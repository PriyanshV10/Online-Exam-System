package com.exam.model;

public class ResultAnswer {
	String question;
	String SelectedOption;
	boolean correct;

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public String getSelectedOption() {
		return SelectedOption;
	}

	public void setSelectedOption(String selectedOption) {
		SelectedOption = selectedOption;
	}

	public boolean isCorrect() {
		return correct;
	}

	public void setCorrect(boolean correct) {
		this.correct = correct;
	}

}
