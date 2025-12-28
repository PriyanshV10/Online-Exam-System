package com.exam.controller;

import java.io.IOException;
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

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
		if(parts.length == 0) {
			getExams(response);
			return;
		}
		
		// api/exams/{id}
		if(parts.length == 1 && isNumber(parts[0])) {
			getExam(response, Integer.parseInt(parts[0]));
			return;
		}
		
		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);
		
		// /api/exams/{id}/start
		if(parts.length == 2 && isNumber(parts[0]) && "start".equals(parts[1])) {
			startExam(request, response, Integer.parseInt(parts[0]));
			return;
		}
		
		// /api/exams/{id}/submit
		if(parts.length == 2 && isNumber(parts[0]) && "submit".equals(parts[1])) {
			submitExam(request, response, Integer.parseInt(parts[0]));
			return;
		}
	}
	
	private void getExams(HttpServletResponse response) throws IOException {
		ExamDao dao = new ExamDao();
		List<Exam> list = dao.getExamsByStatus(ExamStatus.PUBLISHED.name());
		
		ResponseUtil.ok(response, ApiResponse.success(list));
	}
	
	private void getExam(HttpServletResponse response, int examId) throws IOException {
		ExamDao dao = new ExamDao();
		Exam exam = dao.getExamById(examId);
		
		if(exam == null  || !ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam does not exists"));
			return;
		}
		
		ResponseUtil.ok(response, ApiResponse.success(exam));
	}
	
	private void startExam(HttpServletRequest req, HttpServletResponse res, int examId)
	        throws IOException {

	    SessionInfo user = (SessionInfo) req.getSession(false).getAttribute("info");

	    ExamDao examDao = new ExamDao();
	    Exam exam = examDao.getExamById(examId);
	    if (exam == null || !ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
	        ResponseUtil.notFound(res, ApiResponse.error("Exam not available"));
	        return;
	    }

	    AttemptDao attemptDao = new AttemptDao();
	    if (attemptDao.findAttempt(user.getId(), examId) != null) {
	        ResponseUtil.conflict(res, ApiResponse.error("Exam already started"));
	        return;
	    }

	    int attemptId = attemptDao.startAttempt(user.getId(), examId);

	    QuestionDao qDao = new QuestionDao();
	    OptionDao oDao = new OptionDao();

	    List<Question> questions = qDao.getQuestionByExamId(examId);
	    for (Question q : questions) {
	        q.setOptions(oDao.getOptionsForStudent(q.getId()));
	    }

	    ResponseUtil.created(res, ApiResponse.success(
	        Map.of("attemptId", attemptId, "questions", questions)
	    ));
	}
	
	private void submitExam(HttpServletRequest req, HttpServletResponse res, int examId)
	        throws IOException {

	    Gson gson = new Gson();
	    SubmitExamRequest data = gson.fromJson(req.getReader(), SubmitExamRequest.class);

	    AttemptDao attemptDao = new AttemptDao();
	    Attempt attempt = attemptDao.getAttempt(data.getAttemptId());

	    if (attempt == null || attempt.getSubmittedAt() != null) {
	        ResponseUtil.conflict(res, ApiResponse.error("Invalid attempt"));
	        return;
	    }

	    AnswerDao answerDao = new AnswerDao();
	    OptionDao optionDao = new OptionDao();
	    QuestionDao questionDao = new QuestionDao();

	    int score = 0;
	    for (Answer a : answerDao.getAnswers(attempt.getId())) {
	        if (optionDao.isCorrect(a.getOptionId())) {
	            score += questionDao.getMarks(a.getQuestionId());
	        }
	    }

	    attemptDao.submitAttempt(attempt.getId(), score);

	    ResponseUtil.ok(res, ApiResponse.success(Map.of("score", score)));
	}


	
}
