package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import com.exam.dao.ExamDao;
import com.exam.model.CreateExamRequest;
import com.exam.model.SessionInfo;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/admin/create-exam")
public class CreateExamServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		BufferedReader reader = request.getReader();
		Gson gson = new Gson();

		CreateExamRequest data = gson.fromJson(reader, CreateExamRequest.class);

		if (data == null || data.title == null || data.title.trim().isEmpty() || data.description == null
				|| data.duration <= 0 || data.totalMarks <= 0) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write("{\"error\": \"Invalid Input(s)!\"}");

			return;
		}

		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("info") == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("{\"error\":\"Unauthorized\"}");
			return;
		}
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");

		ExamDao dao = new ExamDao();
		int examId = dao.createExam(data.title, data.description, data.duration, data.totalMarks, sessionInfo.getId());

		response.setStatus(HttpServletResponse.SC_CREATED);
		response.getWriter().write("{\"message\": \"Exam Created Successfully!\", \"examId\": " + examId + "}");
	}

}
