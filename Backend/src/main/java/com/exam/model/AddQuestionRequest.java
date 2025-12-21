package com.exam.model;

import java.util.Map;

public class AddQuestionRequest {
	private String text;
	private int marks;
	private Map<Character, String> options;
	private Character correctOption;

	public Character getCorrectOption() {
		return correctOption;
	}

	public void setCorrectOption(Character correctOption) {
		this.correctOption = correctOption;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getMarks() {
		return marks;
	}

	public void setMarks(int marks) {
		this.marks = marks;
	}

	public Map<Character, String> getOptions() {
		return options;
	}

	public void setOptions(Map<Character, String> options) {
		this.options = options;
	}
}
