package com.exam.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.exam.dao.AttemptDao;
import com.exam.dao.ExamDao;
import com.exam.enums.ExamStatus;
import com.exam.model.ApiResponse;
import com.exam.model.Attempt;
import com.exam.model.Exam;
import com.exam.model.SessionInfo;
import com.exam.service.AttemptService;
import com.exam.util.ResponseUtil;
import com.exam.util.TimeUtil;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/stats")
public class StatsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = request.getSession(false);
		SessionInfo sessionInfo = (SessionInfo) session.getAttribute("info");
		Map<String, Object> stats = new HashMap<>();

		ExamDao examDao = new ExamDao();
		AttemptDao attemptDao = new AttemptDao();

		List<Attempt> attempts = attemptDao.getAttemptsByUser(sessionInfo.getId());

		double totalPercent = 0.0;
		long totalMillis = 0;

		for (Attempt attempt : attempts) {
			Exam exam = examDao.getExamById(attempt.getExamId());

			if (attempt.getSubmittedAt() != null && exam.getTotalMarks() > 0) {
				totalPercent += (attempt.getScore() * 100.0) / exam.getTotalMarks();
			}

			long start = attempt.getStartedAt().getTime();

			if (attempt.getSubmittedAt() != null) {
				totalMillis += Math.min(exam.getDuration() * 60L * 1000L, attempt.getSubmittedAt().getTime() - start);
			}
		}

		double averageScore = attempts.isEmpty() ? 0 : totalPercent / attempts.size();

		stats.put("totalExams", examDao.getExamsByStatus(ExamStatus.PUBLISHED.name()).size());
		stats.put("examsTaken", attempts.size());
		stats.put("averageScore", averageScore);
		stats.put("totalSeconds", totalMillis / 1000);

		ResponseUtil.ok(response, ApiResponse.success(stats));
	}

}
