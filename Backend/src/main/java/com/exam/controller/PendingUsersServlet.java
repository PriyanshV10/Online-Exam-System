package com.exam.controller;

import java.io.IOException;
import java.util.List;

import com.exam.dao.UserDao;
import com.exam.model.User;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/admin/pending-users")
public class PendingUsersServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		UserDao dao = new UserDao();
		List<User> list = dao.getPendingUsers();
		
		Gson gson = new Gson();
		String data = gson.toJson(list);
		
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().write(data);
	}
}
