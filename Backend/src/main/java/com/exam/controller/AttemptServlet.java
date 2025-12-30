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

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		int attemptId = Integer.parseInt(request.getPathInfo().substring(1));

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

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {

		int attemptId = Integer.parseInt(req.getPathInfo().substring(1));

		Gson gson = new Gson();
		AnswerRequest data = gson.fromJson(req.getReader(), AnswerRequest.class);

		new AnswerDao().saveAnswer(attemptId, data.getQuestionId(), data.getOptionId());

		ResponseUtil.ok(res, ApiResponse.successMessage("Answer saved"));
	}
}
