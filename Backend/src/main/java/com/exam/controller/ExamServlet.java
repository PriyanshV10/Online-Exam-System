package com.exam.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.exam.dao.AnswerDao;
import com.exam.dao.AttemptDao;
import com.exam.dao.ExamDao;
import com.exam.dao.OptionDao;
import com.exam.dao.QuestionDao;
import com.exam.enums.ExamStatus;
import com.exam.model.Answer;
import com.exam.model.ApiResponse;
import com.exam.model.Attempt;
import com.exam.model.Exam;
import com.exam.model.Question;
import com.exam.model.SessionInfo;
import com.exam.model.SubmitExamRequest;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;
import com.sun.net.httpserver.Request;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/exams/*")
public class ExamServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private String[] pathParts(HttpServletRequest request) {
		String pathInfo = request.getPathInfo();
		if (pathInfo == null || pathInfo.equals("/"))
			return new String[0];
		return pathInfo.substring(1).split("/");
	}

	private boolean isNumber(String s) {
		try {
			Integer.parseInt(s);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/exams
		if (parts.length == 0) {
			getExams(request, response);
			return;
		}

		// api/exams/{id}
		if (parts.length == 1 && isNumber(parts[0])) {
			getExam(request, response, Integer.parseInt(parts[0]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/exams/{id}/attempt
		if (parts.length == 2 && isNumber(parts[0]) && "attempt".equals(parts[1])) {
			startExam(request, response, Integer.parseInt(parts[0]));
			return;
		}

		// /api/exams/{id}/submit
//		if(parts.length == 2 && isNumber(parts[0]) && "submit".equals(parts[1])) {
//			submitExam(request, response, Integer.parseInt(parts[0]));
//			return;
//		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));
	}

	private void getExams(HttpServletRequest request, HttpServletResponse response) throws IOException {
		ExamDao examDao = new ExamDao();
		AttemptDao attemptDao = new AttemptDao();
		SessionInfo sessionInfo = (SessionInfo) request.getSession().getAttribute("info");

		List<Exam> exams = examDao.getExamsByStatus(ExamStatus.PUBLISHED.name());

		List<Map<String, Object>> data = new ArrayList<>();
		for (Exam exam : exams) {
			Map<String, Object> map = new HashMap<>();
			String status = "";

			Attempt attempt = attemptDao.getAttempt(sessionInfo.getId(), exam.getId());

			if (attempt == null) {
				status = "NOT ATTEMPTED";
			} else {
				status = attempt.getSubmittedAt() == null ? "ATTEMPTING" : "ATTEMPTED";
			}

			map.put("id", exam.getId());
			map.put("title", exam.getTitle());
			map.put("description", exam.getDescription());
			map.put("duration", exam.getDuration());
			map.put("totalMarks", exam.getTotalMarks());
			map.put("totalQuestions", examDao.totalQuestions(exam.getId()));
			map.put("status", status);

			data.add(map);
		}

		ResponseUtil.ok(response, ApiResponse.success(data));
	}

	private void getExam(HttpServletRequest request, HttpServletResponse response, int examId) throws IOException {
		ExamDao examDao = new ExamDao();
		AttemptDao attemptDao = new AttemptDao();
		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");

		Exam exam = examDao.getExamById(examId);

		if (exam == null || !ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam does not exists"));
			return;
		}

		Map<String, Object> map = new HashMap<>();

		String status = attemptDao.getAttempt(sessionInfo.getId(), exam.getId()) == null ? "NOT ATTEMPTED"
				: "ATTEMPTED";

		map.put("id", exam.getId());
		map.put("title", exam.getTitle());
		map.put("description", exam.getDescription());
		map.put("duration", exam.getDuration());
		map.put("totalMarks", exam.getTotalMarks());
		map.put("totalQuestions", examDao.totalQuestions(exam.getId()));
		map.put("status", status);

		ResponseUtil.ok(response, ApiResponse.success(map));
	}

	private void startExam(HttpServletRequest req, HttpServletResponse res, int examId) throws IOException {

		SessionInfo user = (SessionInfo) req.getSession(false).getAttribute("info");

		ExamDao examDao = new ExamDao();
		Exam exam = examDao.getExamById(examId);
		if (exam == null || !ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.notFound(res, ApiResponse.error("Exam not available"));
			return;
		}

		AttemptDao attemptDao = new AttemptDao();
		Attempt attempt = attemptDao.getAttempt(user.getId(), examId);

		if (attempt != null) {
			ResponseUtil.ok(res, ApiResponse.success("Exam already started", Map.of("attemptId", attempt.getId())));
			return;
		}

		int attemptId = attemptDao.startAttempt(user.getId(), examId);

		ResponseUtil.ok(res, ApiResponse.success(Map.of("attemptId", attemptId)));
	}

}
