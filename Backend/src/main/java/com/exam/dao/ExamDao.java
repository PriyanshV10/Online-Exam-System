package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.enums.ExamStatus;
import com.exam.model.Exam;
import com.exam.util.DBUtil;

public class ExamDao {

	public int createExam(String title, String description, int duration, int totalMarks, int createdBy) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "INSERT INTO exams (title, description, duration, total_marks, created_by, status) VALUES (?, ?, ?, ?, ?, ?)";
			st = connection.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);

			st.setString(1, title);
			st.setString(2, description);
			st.setInt(3, duration);
			st.setInt(4, totalMarks);
			st.setInt(5, createdBy);
			st.setString(6, ExamStatus.DRAFT.name());

			st.executeUpdate();

			rs = st.getGeneratedKeys();
			if (rs.next()) {
				return rs.getInt(1);
			}

			return -1;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

	public List<Exam> getAllExams() {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM exams ORDER BY created_at DESC";
			st = connection.prepareStatement(query);
			rs = st.executeQuery();

			List<Exam> list = new ArrayList<>();
			while (rs.next()) {
				Exam exam = new Exam();

				exam.setId(rs.getInt("id"));
				exam.setTitle(rs.getString("title"));
				exam.setDescription(rs.getString("description"));
				exam.setDuration(rs.getInt("duration"));
				exam.setTotalMarks(rs.getInt("total_marks"));
				exam.setCreatedBy(rs.getInt("created_by"));
				exam.setStatus(rs.getString("status"));

				list.add(exam);
			}

			return list;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return new ArrayList<>();
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

	public Exam getExamById(int examId) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM exams WHERE id = ?";
			st = connection.prepareStatement(query);

			st.setInt(1, examId);
			rs = st.executeQuery();

			if (rs.next()) {
				Exam exam = new Exam();

				exam.setId(rs.getInt("id"));
				exam.setTitle(rs.getString("title"));
				exam.setDescription(rs.getString("description"));
				exam.setDuration(rs.getInt("duration"));
				exam.setTotalMarks(rs.getInt("total_marks"));
				exam.setCreatedBy(rs.getInt("created_by"));
				exam.setStatus(rs.getString("status"));

				return exam;
			} 

			return null;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

	public void updateExamStatus(int examId, String status) {
		Connection connection = null;
		PreparedStatement st = null;

		try {
			connection = DBUtil.getConnection();
			String query = "UPDATE exams SET status = ? WHERE id = ?";
			st = connection.prepareStatement(query);

			st.setString(1, status);
			st.setInt(2, examId);

			st.executeUpdate();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			DBUtil.closeResources(connection, st, null);
		}
	}

	public boolean hasQuestions(int examId) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT 1 FROM questions WHERE exam_id = ?";
			st = connection.prepareStatement(query);
			st.setInt(1, examId);
			rs = st.executeQuery();

			return rs.next();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

	public List<Exam> getPublishedExams() {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM exams WHERE status = ?";
			st = connection.prepareStatement(query);
			st.setString(1, ExamStatus.PUBLISHED.name());
			rs = st.executeQuery();

			List<Exam> list = new ArrayList<>();
			while (rs.next()) {
				Exam exam = new Exam();

				exam.setId(rs.getInt("id"));
				exam.setTitle(rs.getString("title"));
				exam.setDescription(rs.getString("description"));
				exam.setDuration(rs.getInt("duration"));
				exam.setTotalMarks(rs.getInt("total_marks"));
				exam.setCreatedBy(rs.getInt("created_by"));
				exam.setStatus(rs.getString("status"));

				list.add(exam);
			}

			return list;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return new ArrayList<>();
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

}
