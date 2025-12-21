package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.exam.dao.ExamDao;
import com.exam.model.ApiResponse;
import com.exam.model.CreateExamRequest;
import com.exam.model.Exam;
import com.exam.model.SessionInfo;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/admin/exams")
public class AdminExamServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		ExamDao dao = new ExamDao();
		List<Exam> list = dao.getAllExams();
		
		ResponseUtil.ok(response, ApiResponse.success(list));
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		BufferedReader reader = request.getReader();
		Gson gson = new Gson();

		CreateExamRequest data = gson.fromJson(reader, CreateExamRequest.class);

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

}
