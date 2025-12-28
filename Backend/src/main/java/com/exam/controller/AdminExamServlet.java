package com.exam.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.exam.dao.ExamDao;
import com.exam.dao.OptionDao;
import com.exam.dao.QuestionDao;
import com.exam.enums.ExamStatus;
import com.exam.enums.StatusUpdateResult;
import com.exam.model.AddQuestionRequest;
import com.exam.model.ApiResponse;
import com.exam.model.CreateExamRequest;
import com.exam.model.Exam;
import com.exam.model.Question;
import com.exam.model.SessionInfo;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/admin/exams/*")
public class AdminExamServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Gson gson = new Gson();

	private String[] pathParts(HttpServletRequest request) {
		String pathInfo = request.getPathInfo();
		if (pathInfo == null || pathInfo.equals("/"))
			return new String[0];
		return pathInfo.substring(1).split("/");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/admin/exams
		if (parts.length == 0) {
			listExams(request, response);
			return;
		}

		// /api/admin/exams/{id}
		if (parts.length == 1 && isNumber(parts[0])) {
			getExam(request, response, Integer.parseInt(parts[0]));
			return;
		}

		// /api/admin/exams/{id}/questions
		if (parts.length == 2 && isNumber(parts[0]) && "questions".equals(parts[1])) {
			getQuestions(request, response, Integer.parseInt(parts[0]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/admin/exams
		if (parts.length == 0) {
			createExam(request, response);
			return;
		}

		// /api/admin/exams/{id}/publish
		if (parts.length == 2 && isNumber(parts[0]) && "publish".equals(parts[1])) {
			publishExam(request, response, Integer.parseInt(parts[0]));
			return;
		}

		// /api/admin/exams/{id}/questions
		if (parts.length == 2 && isNumber(parts[0]) && "questions".equals(parts[1])) {
			addQuestion(request, response, Integer.parseInt(parts[0]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not found"));
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/admin/exams/{id}
		if (parts.length == 1 && isNumber(parts[0])) {
			updateExam(request, response, Integer.parseInt(parts[0]));
			return;
		}

		// /api/admin/exams/{eid}/questions/{qid}
		if (parts.length == 3 && isNumber(parts[0]) && "questions".equals(parts[1]) && isNumber(parts[2])) {
			updateQuestion(request, response, Integer.parseInt(parts[0]), Integer.parseInt(parts[2]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not Found"));
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String[] parts = pathParts(request);

		// /api/admin/exams/{id}
		if (parts.length == 1 && isNumber(parts[0])) {
			deleteExam(response, Integer.parseInt(parts[0]));
			return;
		}

		// api/admin/exams/{eid}/questions/{qid}
		if (parts.length == 3 && isNumber(parts[0]) && "questions".equals(parts[1]) && isNumber(parts[2])) {
			deleteQuestion(response, Integer.parseInt(parts[0]), Integer.parseInt(parts[2]));
			return;
		}

		ResponseUtil.notFound(response, ApiResponse.error("Endpoint not Found"));
	}

	private void listExams(HttpServletRequest request, HttpServletResponse response) throws IOException {
		ExamDao dao = new ExamDao();
		List<Exam> list = dao.getAllExams();

		ResponseUtil.ok(response, ApiResponse.success(list));
	}

	private void getExam(HttpServletRequest request, HttpServletResponse response, int examId) throws IOException {
		ExamDao dao = new ExamDao();
		Exam exam = dao.getExamById(examId);

		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Invalid Exam Id"));
			return;
		}

		ResponseUtil.ok(response, ApiResponse.success(exam));
	}

	private void getQuestions(HttpServletRequest request, HttpServletResponse response, int examId) throws IOException {

		ExamDao examDao = new ExamDao();
		if (examDao.getExamById(examId) == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}

		QuestionDao questionDao = new QuestionDao();
		OptionDao optionDao = new OptionDao();

		List<Question> questions = questionDao.getQuestionByExamId(examId);

		for (Question q : questions) {
			q.setOptions(optionDao.getOptionsByQuestionId(q.getId()));
		}

		ResponseUtil.ok(response, ApiResponse.success(questions));
	}

	private void createExam(HttpServletRequest request, HttpServletResponse response) throws IOException {
		CreateExamRequest data = gson.fromJson(request.getReader(), CreateExamRequest.class);

		if (data == null || data.title == null || data.title.trim().isEmpty() || data.description == null
				|| data.duration <= 0 || data.totalMarks <= 0) {
			ResponseUtil.badRequest(response, ApiResponse.error("Invalid Input"));
			return;
		}

		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");

		ExamDao dao = new ExamDao();
		int examId = dao.createExam(data.title, data.description, data.duration, data.totalMarks, sessionInfo.getId());

		ResponseUtil.created(response, ApiResponse.success("Exam Created Successfully", Map.of("examId", examId)));
	}

	private void publishExam(HttpServletRequest request, HttpServletResponse response, int examId) throws IOException {
		ExamDao dao = new ExamDao();
		QuestionDao qDao = new QuestionDao();

		Exam exam = dao.getExamById(examId);
		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}

		if (!dao.hasQuestions(examId)) {
			ResponseUtil.badRequest(response, ApiResponse.error("Exam has no Questions"));
			return;
		}

		if (exam.getTotalMarks() != qDao.getTotalMarks(examId)) {
			ResponseUtil.conflict(response, ApiResponse.error("Total marks mismatch"));
			return;
		}

		StatusUpdateResult res = dao.updateExamStatus(examId, ExamStatus.PUBLISHED.name());

		switch (res) {
		case SUCCESS:
			ResponseUtil.ok(response, ApiResponse.successMessage("Exam published successfully"));
			break;

		case NO_CHANGE:
			ResponseUtil.conflict(response, ApiResponse.error("Exam already published"));
			break;

		case NOT_FOUND:
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			break;
		}
	}

	private void addQuestion(HttpServletRequest request, HttpServletResponse response, int examId)
			throws JsonSyntaxException, JsonIOException, IOException {
		ExamDao examDao = new ExamDao();
		Exam exam = examDao.getExamById(examId);
		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}
		if (ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.conflict(response, ApiResponse.error("Cannot modify published exam"));
			return;
		}

		AddQuestionRequest data = gson.fromJson(request.getReader(), AddQuestionRequest.class);

		if (data == null || data.getText() == null || data.getText().trim().isEmpty() || data.getOptions() == null
				|| data.getCorrectOption() == null) {
			ResponseUtil.badRequest(response, ApiResponse.error("Invalid question data"));
			return;
		}

		if (data.getMarks() <= 0) {
			ResponseUtil.badRequest(response, ApiResponse.error("Question Mark should be greater than 0"));
			return;
		}

		if (data.getOptions().size() < 2) {
			ResponseUtil.badRequest(response, ApiResponse.error("Options should be at least 2"));
			return;
		}

		QuestionDao dao = new QuestionDao();
		int currentMarks = dao.getTotalMarks(examId);
		if (currentMarks + data.getMarks() > exam.getTotalMarks()) {
			ResponseUtil.conflict(response, ApiResponse.error("Total question marks exceed exam total marks"));
			return;
		}

		int questionId = dao.addQuestion(examId, data.getText(), data.getMarks(), data.getOptions(),
				data.getCorrectOption());

		if (questionId == -1) {
			ResponseUtil.serverError(response, ApiResponse.error("Failed to add question"));
			return;
		}

		ResponseUtil.created(response,
				ApiResponse.success("Question added successfully", Map.of("questionId", questionId)));
	}

	private void updateExam(HttpServletRequest request, HttpServletResponse response, int examId)
			throws JsonSyntaxException, JsonIOException, IOException {
		ExamDao examDao = new ExamDao();

		CreateExamRequest data = gson.fromJson(request.getReader(), CreateExamRequest.class);

		if (data == null || data.title == null || data.title.trim().isEmpty() || data.description == null
				|| data.duration <= 0 || data.totalMarks <= 0) {
			ResponseUtil.badRequest(response, ApiResponse.error("Invalid Input"));
			return;
		}

		Exam exam = examDao.getExamById(examId);

		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}

		if (ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.badRequest(response, ApiResponse.error("Cannot Edit a Published Exam"));
			return;
		}

		boolean res = examDao.updateExam(examId, data.title, data.description, data.duration, data.totalMarks);

		if (res) {
			ResponseUtil.ok(response, ApiResponse.success("Exam Updated Successfully", Map.of("examId", examId)));
		} else {
			ResponseUtil.serverError(response, ApiResponse.error("Failed to update exam"));
		}

	}

	private void updateQuestion(HttpServletRequest request, HttpServletResponse response, int examId, int questionId)
			throws JsonSyntaxException, JsonIOException, IOException {
		AddQuestionRequest data = gson.fromJson(request.getReader(), AddQuestionRequest.class);
		if (data == null || data.getText() == null || data.getText().trim().isEmpty() || data.getOptions() == null
				|| data.getCorrectOption() == null) {
			ResponseUtil.badRequest(response, ApiResponse.error("Invalid Question Data"));
			return;
		}

		if (data.getMarks() <= 0) {
			ResponseUtil.badRequest(response, ApiResponse.error("Question Mark should be greater than 0"));
			return;
		}

		if (data.getOptions().size() < 2) {
			ResponseUtil.badRequest(response, ApiResponse.error("Options should be at least 2"));
			return;
		}

		ExamDao examDao = new ExamDao();
		QuestionDao questionDao = new QuestionDao();

		Exam exam = examDao.getExamById(examId);
		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}

		if (ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.conflict(response, ApiResponse.error("Cannot modify published exam"));
			return;
		}

		Question question = questionDao.getQuestionById(questionId);
		if (question == null || question.getExamId() != examId) {
			ResponseUtil.notFound(response, ApiResponse.error("Question not found"));
			return;
		}

		boolean res = questionDao.updateQuestion(questionId, data.getText(), data.getMarks(), data.getOptions(),
				data.getCorrectOption());
		if (res) {
			ResponseUtil.ok(response, ApiResponse.success("Question updated", Map.of("questionId", questionId)));
		} else {
			ResponseUtil.serverError(response, ApiResponse.error("Failed to Update"));
		}

	}

	private void deleteExam(HttpServletResponse response, int examId) throws IOException {
		ExamDao examDao = new ExamDao();
		Exam exam = examDao.getExamById(examId);

		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}

		if (ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.badRequest(response, ApiResponse.error("Cannot delete a published exam"));
			return;
		}

		boolean res = examDao.deleteExam(examId);

		if (res) {
			ResponseUtil.noContent(response);
		} else {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
		}
	}

	private void deleteQuestion(HttpServletResponse response, int examId, int questionId) throws IOException {
		ExamDao examDao = new ExamDao();
		Exam exam = examDao.getExamById(examId);

		if (exam == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Exam not found"));
			return;
		}

		if (ExamStatus.PUBLISHED.name().equals(exam.getStatus())) {
			ResponseUtil.conflict(response, ApiResponse.error("Cannot modify published exam"));
			return;
		}

		QuestionDao questionDao = new QuestionDao();
		Question question = questionDao.getQuestionById(questionId);
		if (question == null || question.getExamId() != examId) {
			ResponseUtil.notFound(response, ApiResponse.error("Question not found"));
			return;
		}

		boolean res = questionDao.deleteQuestion(questionId);
		if (res) {
			ResponseUtil.noContent(response);
		} else {
			ResponseUtil.serverError(response, ApiResponse.error("Failed to delete question"));
		}
	}

	private boolean isNumber(String s) {
		try {
			Integer.parseInt(s);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

}
