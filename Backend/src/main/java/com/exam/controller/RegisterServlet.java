package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import org.mindrot.jbcrypt.BCrypt;

import com.exam.dao.UserDao;
import com.exam.model.RegisterRequest;
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
		response.setCharacterEncoding("UTF-8");

		BufferedReader reader = request.getReader();
		Gson gson = new Gson();
		RegisterRequest data = gson.fromJson(reader, RegisterRequest.class);

		response.setContentType("application/json");

		if (data == null || data.name == null || data.email == null || data.password == null || data.name.trim().isEmpty()
				|| data.email.trim().isEmpty() || data.password.trim().isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

			response.getWriter().write("{\"error\":\"Name or Email or Password cannot be Empty.\"}");
			return;
		}
		
		UserDao dao = new UserDao();
		if(dao.emailExists(data.email)) {
			response.setStatus(HttpServletResponse.SC_CONFLICT);
			
			response.getWriter().write("{\"error\":\"User already exists!\"}");
			return;
		}
		
		String hashedPassword = BCrypt.hashpw(data.password, BCrypt.gensalt());
		dao.createUser(data.name, data.email, hashedPassword, "STUDENT", "PENDING");
		
		response.setStatus(HttpServletResponse.SC_CREATED);
		response.getWriter().write("{\"message\":\"Request sent for approval.\"}");
		
	}

}
