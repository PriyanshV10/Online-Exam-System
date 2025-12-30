package com.exam.service;

import java.sql.Timestamp;
import java.time.Instant;

import com.exam.dao.AttemptDao;
import com.exam.dao.ExamDao;
import com.exam.model.Attempt;

public class AttemptService {

	public boolean isExpired(Attempt attempt, int durationMinutes) {
		if (durationMinutes <= 0)
			return false;

		long start = attempt.getStartedAt().getTime();
		long end = start + durationMinutes * 60L * 1000L;
		long now = System.currentTimeMillis();

		return now >= end;
	}

	public boolean checkAndAutoSubmit(Attempt attempt, int durationMinutes) {

		if (attempt.getSubmittedAt() != null) {
			return true;
		}

		if (isExpired(attempt, durationMinutes)) {
			autoSubmit(attempt);
			return true;
		}

		return false;
	}

	public void autoSubmit(Attempt attempt) {
		if (attempt.getSubmittedAt() != null)
			return;

		AttemptDao attemptDao = new AttemptDao();
		ExamDao examDao = new ExamDao();

		int score = examDao.calculateScore(attempt.getId());
		Timestamp now = Timestamp.from(Instant.now());

		attemptDao.submitAttempt(attempt.getId(), score, now);
		attempt.setSubmittedAt(now);
		attempt.setScore(score);
	}

}
