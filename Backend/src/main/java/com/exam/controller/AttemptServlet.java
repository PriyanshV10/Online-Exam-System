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
import com.exam.model.AnswerRequest;
import com.exam.model.ApiResponse;
import com.exam.model.Attempt;
import com.exam.model.Exam;
import com.exam.model.Option;
import com.exam.model.Question;
import com.exam.model.SessionInfo;
import com.exam.service.AttemptService;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/attempts/*")
public class AttemptServlet extends HttpServlet {
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

		// /api/attempts/{id}
		if (parts.length == 1 && isNumber(parts[0])) {
			getAttempt(request, response, Integer.parseInt(parts[0]));
			return;
		}

		// /api/attempts/{id}/result
		if (parts.length == 2 && isNumber(parts[0]) && "result".equals(parts[1])) {
			getResult(request, response, Integer.parseInt(parts[0]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/attempts/{id}/answer
		if (parts.length == 2 && isNumber(parts[0]) && "answer".equals(parts[1])) {
			saveAnswer(request, response, Integer.parseInt(parts[0]));
			return;
		}

		// /api/attempts/{id}/submit
		if (parts.length == 2 && isNumber(parts[0]) && "submit".equals(parts[1])) {
			submitAttempt(request, response, Integer.parseInt(parts[0]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));
	}

	private void getAttempt(HttpServletRequest request, HttpServletResponse response, int attemptId)
			throws IOException {
		AttemptDao attemptDao = new AttemptDao();
		QuestionDao questionDao = new QuestionDao();
		OptionDao optionDao = new OptionDao();
		AnswerDao answerDao = new AnswerDao();
		ExamDao examDao = new ExamDao();

		Attempt attempt = attemptDao.getAttemptById(attemptId);
		if (attempt == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Attempt not found"));
			return;
		}

		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");
		if (sessionInfo.getId() != attempt.getUserId()) {
			ResponseUtil.forbidden(response, ApiResponse.error("Not allowed"));
			return;
		}

		Exam exam = examDao.getExamById(attempt.getExamId());

		AttemptService attemptService = new AttemptService();
		boolean submitted = attemptService.checkAndAutoSubmit(attempt, exam.getDuration());
		if (submitted) {
			attempt = attemptDao.getAttemptById(attemptId);
			ResponseUtil.ok(response, ApiResponse.success(
					Map.of("isSubmitted", true, "submittedAt", attempt.getSubmittedAt().toInstant().toString())));
			return;
		}

		Map<String, Object> data = new HashMap<>();
		data.put("isSubmitted", false);
		data.put("startedAt", attempt.getStartedAt().toInstant().toString());

		List<Question> questions = questionDao.getQuestionsByExamId(attempt.getExamId());

		List<Map<String, Object>> ques = new ArrayList<>();

		for (Question question : questions) {
			Map<String, Object> map = new HashMap<>();

			map.put("questionId", question.getId());
			map.put("questionText", question.getText());
			map.put("questionMarks", question.getMarks());

			List<Map<String, Object>> opts = new ArrayList<>();
			List<Option> options = optionDao.getOptionsByQuestionId(question.getId());

			for (Option option : options) {
				Map<String, Object> oMap = new HashMap<>();

				oMap.put("optionId", option.getId());
				oMap.put("optionLabel", option.getLabel());
				oMap.put("optionText", option.getText());

				opts.add(oMap);
			}

			map.put("selectedOption", answerDao.getSelectedOption(attemptId, question.getId()));
			map.put("options", opts);
			ques.add(map);
		}

		data.put("questions", ques);

		ResponseUtil.ok(response, ApiResponse.success(data));
	}

	private void getResult(HttpServletRequest request, HttpServletResponse response, int attemptId) throws IOException {
		AttemptDao attemptDao = new AttemptDao();
		QuestionDao questionDao = new QuestionDao();
		OptionDao optionDao = new OptionDao();
		AnswerDao answerDao = new AnswerDao();
		ExamDao examDao = new ExamDao();

		Attempt attempt = attemptDao.getAttemptById(attemptId);
		if (attempt == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Attempt not found"));
			return;
		}

		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");
		if (sessionInfo.getId() != attempt.getUserId()) {
			ResponseUtil.forbidden(response, ApiResponse.error("Not allowed"));
			return;
		}

		Exam exam = examDao.getExamById(attempt.getExamId());

		AttemptService attemptService = new AttemptService();
		boolean submitted = attemptService.checkAndAutoSubmit(attempt, exam.getDuration());
		if (!submitted) {
			attempt = attemptDao.getAttemptById(attemptId);
			ResponseUtil.ok(response, ApiResponse.success(Map.of("isSubmitted", false)));
			return;
		}

		Map<String, Object> data = new HashMap<>();
		data.put("isSubmitted", true);
		data.put("startedAt", attempt.getStartedAt().toInstant().toString());
		data.put("submittedAt", attempt.getSubmittedAt().toInstant().toString());
		data.put("examId", exam.getId());
		data.put("examTitle", exam.getTitle());
		data.put("examDuration", exam.getDuration());
		data.put("score", attempt.getScore());
		data.put("totalMarks", exam.getTotalMarks());
		data.put("percentage", exam.getTotalMarks() == 0 ? 0 : (attempt.getScore() * 100.0) / exam.getTotalMarks());

		List<Question> questions = questionDao.getQuestionsByExamId(attempt.getExamId());
		List<Map<String, Object>> ques = new ArrayList<>();

		for (Question question : questions) {
			Map<String, Object> map = new HashMap<>();

			map.put("questionId", question.getId());
			map.put("questionText", question.getText());
			map.put("questionMarks", question.getMarks());

			List<Map<String, Object>> opts = new ArrayList<>();
			List<Option> options = optionDao.getOptionsByQuestionId(question.getId());

			for (Option option : options) {
				Map<String, Object> oMap = new HashMap<>();

				oMap.put("optionId", option.getId());
				oMap.put("optionLabel", option.getLabel());
				oMap.put("optionText", option.getText());
				oMap.put("isCorrect", option.isCorrect());

				opts.add(oMap);
			}

			map.put("selectedOption", answerDao.getSelectedOption(attemptId, question.getId()));
			map.put("options", opts);
			ques.add(map);
		}

		data.put("questions", ques);

		ResponseUtil.ok(response, ApiResponse.success(data));
	}

	private void saveAnswer(HttpServletRequest request, HttpServletResponse response, int attemptId)
			throws IOException {
		Gson gson = new Gson();
		AttemptDao attemptDao = new AttemptDao();
		ExamDao examDao = new ExamDao();
		AnswerDao answerDao = new AnswerDao();

		Attempt attempt = attemptDao.getAttemptById(attemptId);
		if (attempt == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Attempt not found"));
			return;
		}

		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");
		if (sessionInfo.getId() != attempt.getUserId()) {
			ResponseUtil.forbidden(response, ApiResponse.error("Not allowed"));
			return;
		}

		Exam exam = examDao.getExamById(attempt.getExamId());

		AttemptService attemptService = new AttemptService();
		boolean submitted = attemptService.checkAndAutoSubmit(attempt, exam.getDuration());
		if (submitted) {
			attempt = attemptDao.getAttemptById(attemptId);
			ResponseUtil.ok(response, ApiResponse.success(
					Map.of("isSubmitted", true, "submittedAt", attempt.getSubmittedAt().toInstant().toString())));
			return;
		}

		Map<String, Object> res = new HashMap<>();
		res.put("isSubmitted", false);

		AnswerRequest data = gson.fromJson(request.getReader(), AnswerRequest.class);

		answerDao.saveAnswer(attemptId, data.getQuestionId(), data.getOptionId());

		ResponseUtil.ok(response, ApiResponse.success(res));
	}

	private void submitAttempt(HttpServletRequest request, HttpServletResponse response, int attemptId)
			throws IOException {
		AttemptDao attemptDao = new AttemptDao();

		Attempt attempt = attemptDao.getAttemptById(attemptId);
		if (attempt == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Attempt not found"));
			return;
		}

		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");
		if (sessionInfo.getId() != attempt.getUserId()) {
			ResponseUtil.forbidden(response, ApiResponse.error("Not allowed"));
			return;
		}

		AttemptService attemptService = new AttemptService();
		attemptService.autoSubmit(attempt);

		ResponseUtil.noContent(response);
	}

}
