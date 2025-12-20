package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import com.exam.dao.UserDao;
import com.exam.enums.UserStatus;
import com.exam.model.ApproveUserRequest;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/admin/update-user")
public class ApproveUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");

		BufferedReader reader = request.getReader();
		Gson gson = new Gson();
		ApproveUserRequest data = gson.fromJson(reader, ApproveUserRequest.class);
		
		StringBuilder rawBody = new StringBuilder();
		String line;
		while ((line = reader.readLine()) != null) {
			rawBody.append(line);
		}
		System.out.println(rawBody.toString());
		
		if(data == null || data.id <= 0 || data.status == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write("{\"message\": \"Invalid User Id!\"}");
			
			return;
		}
		
		UserDao dao = new UserDao();		
		
		if(UserStatus.APPROVED.name().equalsIgnoreCase(data.status)) {
			dao.updateUserStatus(data.id, UserStatus.APPROVED.name());
			response.setStatus(HttpServletResponse.SC_OK);
			response.getWriter().write("{\"message\": \"Request Approved!\"}");			
		}
		else if(UserStatus.REJECTED.name().equalsIgnoreCase(data.status)) {
			dao.updateUserStatus(data.id, UserStatus.REJECTED.name());
			response.setStatus(HttpServletResponse.SC_OK);
			response.getWriter().write("{\"message\": \"Request Rejected!\"}");	
		}
		else {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write("{\"message\": \"Invalid Status Request!\"}");			
		}
	}
}
