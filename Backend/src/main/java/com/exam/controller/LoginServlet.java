package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import org.mindrot.jbcrypt.BCrypt;

import com.exam.dao.UserDao;
import com.exam.enums.UserRole;
import com.exam.enums.UserStatus;
import com.exam.model.ApiResponse;
import com.exam.model.LoginRequest;
import com.exam.model.SessionInfo;
import com.exam.model.User;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {		
		BufferedReader reader = request.getReader();

		Gson gson = new Gson();
		LoginRequest data = gson.fromJson(reader, LoginRequest.class);

		if (data == null || data.email == null || data.password == null || data.email.trim().isEmpty()
				|| data.password.trim().isEmpty()) {
			ResponseUtil.badRequest(response, ApiResponse.error("Email and Password is required"));
			return;
		}

		UserDao dao = new UserDao();
		User user = dao.findByEmail(data.email);

		if (user == null) {
			ResponseUtil.unauthorized(response, ApiResponse.error("User Not Found!"));
			return;
		}

		if (!BCrypt.checkpw(data.password, user.getPassword())) {
			ResponseUtil.unauthorized(response, ApiResponse.error("Wrong Password"));
			return;
		}
		
		if(UserRole.STUDENT.name().equals(user.getRole())) {
			if(UserStatus.PENDING.name().equals(user.getStatus())) {
				ResponseUtil.forbidden(response, ApiResponse.error("Pending Admin Approval"));
				return;
			}
			
			if(UserStatus.REJECTED.name().equals(user.getStatus())) {
				ResponseUtil.forbidden(response, ApiResponse.error("Account Approval Rejected"));
				return;
			}
		}
		
		HttpSession session = request.getSession();
		
		SessionInfo sessionInfo = new SessionInfo();
		sessionInfo.setId(user.getId());
		sessionInfo.setName(user.getName());
		sessionInfo.setEmail(user.getEmail());
		sessionInfo.setRole(user.getRole());
		session.setAttribute("info", sessionInfo);
		
		ResponseUtil.ok(response, ApiResponse.success(sessionInfo));

	}
}
