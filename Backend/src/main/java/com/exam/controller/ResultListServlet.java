package com.exam.controller;

import java.io.IOException;
import java.util.List;

import com.exam.dao.AttemptDao;
import com.exam.model.ApiResponse;
import com.exam.model.ResultDto;
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
		AttemptDao attemptDao = new AttemptDao();

		List<ResultDto> results = attemptDao.getResultsByUser(user.getId());

		ResponseUtil.ok(res, ApiResponse.success(results));
	}
}
