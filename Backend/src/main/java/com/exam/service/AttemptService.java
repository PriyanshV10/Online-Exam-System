package com.exam.service;

import java.sql.Timestamp;
import java.util.Arrays;

import com.exam.dao.AttemptDao;
import com.exam.dao.ExamDao;
import com.exam.model.Attempt;
import com.exam.util.TimeUtil;

public class AttemptService {

	public boolean isExpired(Attempt attempt, int durationMinutes) {
		if (durationMinutes <= 0)
			return false;

		long startMillis = attempt.getStartedAt().getTime();
		long endMillis = startMillis + durationMinutes * 60L * 1000L;
		long nowMillis = TimeUtil.getCurrentTime();

		System.out.println(Arrays.asList(startMillis, endMillis, nowMillis));

		return nowMillis >= endMillis;
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
		Timestamp now = new Timestamp(TimeUtil.getCurrentTime());

		attemptDao.submitAttempt(attempt.getId(), score, now);

		attempt.setSubmittedAt(now);
		attempt.setScore(score);
	}

}
