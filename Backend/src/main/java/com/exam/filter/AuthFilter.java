package com.exam.filter;

import java.io.IOException;

import com.exam.enums.UserRole;
import com.exam.model.ApiResponse;
import com.exam.model.SessionInfo;
import com.exam.util.ResponseUtil;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebFilter("/api/*")
public class AuthFilter implements Filter {

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		String path = request.getRequestURI().substring(request.getContextPath().length());

		if (path.contains("/login") || path.contains("/register") || path.contains("/me")) {
			chain.doFilter(request, response);
			return;
		}

		HttpSession session = request.getSession(false);

		if (session == null || session.getAttribute("info") == null) {
			ResponseUtil.unauthorized(response);
			return;
		}

		if (path.contains("/admin")) {
			SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");

			if (!UserRole.ADMIN.name().equals(sessionInfo.getRole())) {
				ResponseUtil.forbidden(response, ApiResponse.error("Unauthorized"));
				return;
			}
		}

		chain.doFilter(request, response);
	}

}
