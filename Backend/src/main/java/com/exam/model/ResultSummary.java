package com.exam.model;

public class ResultSummary {
    private int attemptId;
    private int examId;
    private int score;
    private long durationMinutes;
	public int getAttemptId() {
		return attemptId;
	}
	public void setAttemptId(int attemptId) {
		this.attemptId = attemptId;
	}
	public int getExamId() {
		return examId;
	}
	public void setExamId(int examId) {
		this.examId = examId;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public long getDurationMinutes() {
		return durationMinutes;
	}
	public void setDurationMinutes(long durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

    
}

