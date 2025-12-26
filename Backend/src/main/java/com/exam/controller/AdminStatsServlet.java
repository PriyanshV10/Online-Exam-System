package com.exam.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.exam.dao.ExamDao;
import com.exam.dao.UserDao;
import com.exam.enums.ExamStatus;
import com.exam.enums.UserStatus;
import com.exam.model.ApiResponse;
import com.exam.util.ResponseUtil;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/admin/stats")
public class AdminStatsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Map<String, Integer> stats = new HashMap<>();
		
		ExamDao examDao = new ExamDao();
		UserDao userDao = new UserDao();
		
		stats.put("totalExams", examDao.getAllExams().size());
		stats.put("publishedExams", examDao.getExamsByStatus(ExamStatus.PUBLISHED.name()).size());
		stats.put("totalUsers", userDao.getAllUsers().size());
		stats.put("approvedUsers", userDao.getUsersByStatus(UserStatus.APPROVED.name()).size());
		
		ResponseUtil.ok(response, ApiResponse.success(stats));
	}

}
