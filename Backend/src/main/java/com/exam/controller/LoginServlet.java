package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import org.mindrot.jbcrypt.BCrypt;

import com.exam.dao.UserDao;
import com.exam.model.LoginRequest;
import com.exam.model.SessionInfo;
import com.exam.model.User;
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
		response.setCharacterEncoding("UTF-8");
		
		BufferedReader reader = request.getReader();

//		StringBuilder rawBody = new StringBuilder();
//		String line;
//		while ((line = reader.readLine()) != null) {
//			rawBody.append(line);
//		}
//		System.out.println(rawBody.toString());

		Gson gson = new Gson();
		LoginRequest data = gson.fromJson(reader, LoginRequest.class);

		response.setContentType("application/json");

		if (data == null || data.email == null || data.password == null || data.email.trim().isEmpty()
				|| data.password.trim().isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

			response.getWriter().write("{\"error\":\"Email or Password is Empty.\"}");
			return;
		}

		UserDao dao = new UserDao();
		User user = dao.findByEmail(data.email);

		if (user == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

			response.getWriter().write("{\"error\":\"No User Found!\"}");
			return;
		}

		if (!BCrypt.checkpw(data.password, user.getPassword())) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

			response.getWriter().write("{\"error\":\"Wrong Password!\"}");
			return;
		}
		
		if(user.getRole().equals("STUDENT")) {
			if(user.getStatus().equals("PENDING")) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				
				response.getWriter().write("{\"error\":\"Pending Admin Approval!\"}");
				return;
			}
			
			if(user.getStatus().equals("REJECTED")) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				
				response.getWriter().write("{\"error\":\"Account Approval Rejected!\"}");
				return;
			}
		}
		
		HttpSession session = request.getSession();
		
		SessionInfo userResponse = new SessionInfo(user.getId(), user.getName(), user.getRole());
		session.setAttribute("info", userResponse);
		String json = gson.toJson(userResponse);
		
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().write(json);

	}
}
