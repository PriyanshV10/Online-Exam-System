package com.exam.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.exam.dao.AttemptDao;
import com.exam.model.ApiResponse;
import com.exam.model.Attempt;
import com.exam.model.ResultSummary;
import com.exam.model.SessionInfo;
import com.exam.util.ResponseUtil;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/results")
public class ResultListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {

		SessionInfo user = (SessionInfo) req.getSession(false).getAttribute("info");

		AttemptDao dao = new AttemptDao();
		List<Attempt> attempts = dao.getAttemptsByUser(user.getId());

		List<ResultSummary> results = new ArrayList<>();

		for (Attempt a : attempts) {
			ResultSummary r = new ResultSummary();
			r.setAttemptId(a.getId());
			r.setExamId(a.getExamId());
			r.setScore(a.getScore());

			long duration = (a.getSubmittedAt().getTime() - a.getStartedAt().getTime()) / (1000 * 60);

			r.setDurationMinutes(duration);
			results.add(r);
		}

		ResponseUtil.ok(res, ApiResponse.success(results));
	}
}
