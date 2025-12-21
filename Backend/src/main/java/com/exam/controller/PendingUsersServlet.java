package com.exam.controller;

import java.io.IOException;
import java.util.List;

import com.exam.dao.UserDao;
import com.exam.model.ApiResponse;
import com.exam.model.User;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/admin/users")
public class PendingUsersServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		UserDao dao = new UserDao();
		List<User> list = dao.getPendingUsers();
		
		ResponseUtil.ok(response, ApiResponse.success(list));
	}
}
