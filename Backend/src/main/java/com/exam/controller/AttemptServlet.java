package com.exam.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.exam.dao.AnswerDao;
import com.exam.dao.AttemptDao;
import com.exam.dao.OptionDao;
import com.exam.dao.QuestionDao;
import com.exam.model.AnswerRequest;
import com.exam.model.ApiResponse;
import com.exam.model.Attempt;
import com.exam.model.Question;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/attempts/*")
public class AttemptServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		int attemptId = Integer.parseInt(request.getPathInfo().substring(1));

		AttemptDao attemptDao = new AttemptDao();
		Attempt attempt = attemptDao.getAttempt(attemptId);

		if (attempt == null) {
			ResponseUtil.notFound(response, ApiResponse.error("Attempt not found"));
			return;
		}

		QuestionDao qDao = new QuestionDao();
		OptionDao oDao = new OptionDao();

		List<Question> questions = qDao.getQuestionByExamId(attempt.getExamId());
		for (Question q : questions) {
			q.setOptions(oDao.getOptionsForStudent(q.getId()));
		}

		ResponseUtil.ok(response, ApiResponse.success(Map.of("attemptId", attemptId, "questions", questions)));
	}
	
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {

        int attemptId = Integer.parseInt(req.getPathInfo().substring(1));

        Gson gson = new Gson();
        AnswerRequest data = gson.fromJson(req.getReader(), AnswerRequest.class);

        new AnswerDao().saveAnswer(
            attemptId,
            data.getQuestionId(),
            data.getOptionId()
        );

        ResponseUtil.ok(res, ApiResponse.successMessage("Answer saved"));
    }
}
