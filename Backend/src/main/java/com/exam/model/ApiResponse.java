package com.exam.model;

public class ApiResponse<T> {

	private boolean success;
	private T data;
	private String message;

	private ApiResponse() {
	}

	public static <T> ApiResponse<T> successMessage(String message) {
		ApiResponse<T> res = new ApiResponse<>();
		res.setSuccess(true);
		res.setMessage(message);
		return res;
	}

	public static <T> ApiResponse<T> success(T data) {
		ApiResponse<T> res = new ApiResponse<>();
		res.setSuccess(true);
		res.setData(data);
		return res;
	}

	public static <T> ApiResponse<T> success(String message, T data) {
		ApiResponse<T> res = new ApiResponse<>();
		res.setSuccess(true);
		res.setMessage(message);
		res.setData(data);
		return res;
	}

	// Error
	public static <T> ApiResponse<T> error(String message) {
		ApiResponse<T> res = new ApiResponse<>();
		res.setSuccess(false);
		res.setMessage(message);
		return res;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
