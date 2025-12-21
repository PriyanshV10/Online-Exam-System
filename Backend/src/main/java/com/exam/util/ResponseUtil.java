package com.exam.util;

import java.io.IOException;

import com.exam.model.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;

public class ResponseUtil {

	//TODO: Remove all String message and replace with Object change all occurences too.
	
	private ResponseUtil() {
		// prevent instantiation
	}

	public static void write(HttpServletResponse response, int status, Object body) throws IOException {

		response.setStatus(status);
		response.setContentType("application/json;charset=UTF-8");

		if (body != null) {
			response.getWriter().write(JsonUtil.toJson(body));
		}
	}

	/* ---------- Convenience methods ---------- */

	public static void ok(HttpServletResponse response, Object data) throws IOException {
		write(response, HttpServletResponse.SC_OK, data);
	}

	public static void created(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_CREATED, body);
	}

	public static void noContent(HttpServletResponse response) {
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}

	public static void badRequest(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_BAD_REQUEST, body);
	}

	public static void unauthorized(HttpServletResponse response) throws IOException {
		unauthorized(response, "Authentication required");
	}

	public static void unauthorized(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_UNAUTHORIZED, body);
	}

	public static void forbidden(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_FORBIDDEN, body);
	}

	public static void notFound(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_NOT_FOUND, body);
	}
	
	public static void conflict(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_CONFLICT, body);
	}

	public static void serverError(HttpServletResponse response, Object body) throws IOException {
		write(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, body);
	}
}
