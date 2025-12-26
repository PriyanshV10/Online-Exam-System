package com.exam.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.exam.dao.AnswerDao;
import com.exam.dao.AttemptDao;
import com.exam.model.ApiResponse;
import com.exam.model.Attempt;
import com.exam.model.ResultAnswer;
import com.exam.model.SessionInfo;
import com.exam.util.ResponseUtil;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/results/*")
public class ResultDetailsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {

		int attemptId = Integer.parseInt(req.getPathInfo().substring(1));

		SessionInfo user = (SessionInfo) req.getSession(false).getAttribute("info");

		AttemptDao attemptDao = new AttemptDao();
		Attempt attempt = attemptDao.getAttemptById(attemptId);

		if (attempt == null || attempt.getUserId() != user.getId()) {
			ResponseUtil.notFound(res, ApiResponse.error("Result not found"));
			return;
		}

		AnswerDao answerDao = new AnswerDao();
		List<ResultAnswer> answers = answerDao.getResultAnswers(attemptId);

		ResponseUtil.ok(res, ApiResponse.success(Map.of("attempt", attempt, "answers", answers)));
	}
}
