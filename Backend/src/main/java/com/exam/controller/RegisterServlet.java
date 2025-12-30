package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import org.mindrot.jbcrypt.BCrypt;

import com.exam.dao.UserDao;
import com.exam.enums.UserRole;
import com.exam.enums.UserStatus;
import com.exam.model.ApiResponse;
import com.exam.model.RegisterRequest;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/register")
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		BufferedReader reader = request.getReader();
		Gson gson = new Gson();
		RegisterRequest data = gson.fromJson(reader, RegisterRequest.class);

		if (data == null || data.name == null || data.email == null || data.password == null || data.name.trim().isEmpty()
				|| data.email.trim().isEmpty() || data.password.trim().isEmpty()) {
			ResponseUtil.badRequest(response, ApiResponse.error("Invalid Input"));
			return;
		}
		
		UserDao dao = new UserDao();
		if(dao.emailExists(data.email)) {
			ResponseUtil.conflict(response, ApiResponse.error("User Already Exists"));
			return;
		}
		
		String hashedPassword = BCrypt.hashpw(data.password, BCrypt.gensalt());
		dao.createUser(data.name, data.email, hashedPassword, UserRole.STUDENT.name(), UserStatus.PENDING.name());
		
		ResponseUtil.created(response, ApiResponse.successMessage("Request sent for approval"));
		
	}

}
