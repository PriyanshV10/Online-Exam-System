package com.exam.model;

public class AnswerRequest {
	Integer questionId;
	Integer optionId;

	public Integer getQuestionId() {
		return questionId;
	}

	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}

	public Integer getOptionId() {
		return optionId;
	}

	public void setOptionId(int optionId) {
		this.optionId = optionId;
	}

}
