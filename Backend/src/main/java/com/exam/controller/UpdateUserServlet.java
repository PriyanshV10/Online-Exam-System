package com.exam.controller;

import java.io.BufferedReader;
import java.io.IOException;

import com.exam.dao.UserDao;
import com.exam.enums.UserStatus;
import com.exam.model.ApiResponse;
import com.exam.model.UpdateUserRequest;
import com.exam.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/admin/users/*")
public class UpdateUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException {

	    if ("PATCH".equalsIgnoreCase(request.getMethod())) {
	        doPatch(request, response);
	    } else {
	        super.service(request, response);
	    }
	}

	protected void doPatch(HttpServletRequest request, HttpServletResponse response) throws IOException {

	    String pathInfo = request.getPathInfo();
	    if (pathInfo == null || pathInfo.equals("/")) {
	    	ResponseUtil.badRequest(response, ApiResponse.error("User ID missing"));
	        return;
	    }

	    String[] parts = pathInfo.split("/");
	    if (parts.length != 2) {
	    	ResponseUtil.badRequest(response, ApiResponse.error("Invalid URL"));
	        return;
	    }

	    int userId;
	    try {
	        userId = Integer.parseInt(parts[1]);
	    } catch (NumberFormatException e) {
	    	ResponseUtil.badRequest(response, ApiResponse.error("Invalid User ID"));
	        return;
	    }

	    BufferedReader reader = request.getReader();
	    Gson gson = new Gson();
	    UpdateUserRequest data = gson.fromJson(reader, UpdateUserRequest.class);

	    if (data == null || data.status == null) {
	    	ResponseUtil.badRequest(response, ApiResponse.error("Invalid request body"));
	        return;
	    }

	    UserDao dao = new UserDao();
	    boolean updated;

	    if (UserStatus.APPROVED.name().equalsIgnoreCase(data.status)) {
	        updated = dao.updateUserStatus(userId, UserStatus.APPROVED.name());
	    } else if (UserStatus.REJECTED.name().equalsIgnoreCase(data.status)) {
	        updated = dao.updateUserStatus(userId, UserStatus.REJECTED.name());
	    } else {
	    	ResponseUtil.badRequest(response, ApiResponse.error("Invalid Status Request"));
	        return;
	    }

	    if (!updated) {
	    	ResponseUtil.notFound(response, "User not found");
	        return;
	    }

	    ResponseUtil.noContent(response);
	}

}
