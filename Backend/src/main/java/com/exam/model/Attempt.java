package com.exam.model;

import java.sql.Timestamp;

public class Attempt {
	int id;
	int userId;
	int examId;
	int score;
	Timestamp startedAt;
	Timestamp submittedAt;
	
	public Timestamp getStartedAt() {
		return startedAt;
	}
	public void setStartedAt(Timestamp startedAt) {
		this.startedAt = startedAt;
	}
	public Timestamp getSubmittedAt() {
		return submittedAt;
	}
	public void setSubmittedAt(Timestamp submieedAt) {
		this.submittedAt = submieedAt;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
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
	
	
}
