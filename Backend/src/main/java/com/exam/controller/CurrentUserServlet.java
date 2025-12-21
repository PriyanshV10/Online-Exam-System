package com.exam.controller;

import java.io.IOException;

import com.exam.model.ApiResponse;
import com.exam.model.SessionInfo;
import com.exam.util.ResponseUtil;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/me")
public class CurrentUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = request.getSession(false);
		if (session == null) {
			ResponseUtil.unauthorized(response);
			return;
		}
		
		SessionInfo info = (SessionInfo) session.getAttribute("info");
		if(info == null) {
			ResponseUtil.unauthorized(response);
			return;
		}
		
		ResponseUtil.ok(response, info);
	}
}
