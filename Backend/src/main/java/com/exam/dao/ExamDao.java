package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.enums.ExamStatus;
import com.exam.enums.StatusUpdateResult;
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

	public boolean updateExam(int examId, String title, String description, int duration, int totalMarks) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "UPDATE exams SET title = ?, description = ?, duration = ?, total_marks = ? WHERE id = ?";
			st = connection.prepareStatement(query);

			st.setString(1, title);
			st.setString(2, description);
			st.setInt(3, duration);
			st.setInt(4, totalMarks);
			st.setInt(5, examId);

			return st.executeUpdate() > 0;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

	public boolean deleteExam(int examId) {
		String sql = "DELETE FROM exams WHERE id = ?";
		try (Connection con = DBUtil.getConnection(); PreparedStatement st = con.prepareStatement(sql)) {
			st.setInt(1, examId);
			return st.executeUpdate() == 1;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public List<Exam> getAllExams() {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM exams ORDER BY created_at DESC, id DESC";
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

	public StatusUpdateResult updateExamStatus(int examId, String newStatus) {

		String sql = "UPDATE exams SET status = ? WHERE id = ? AND status != ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setString(1, newStatus);
			ps.setInt(2, examId);
			ps.setString(3, newStatus);

			int rows = ps.executeUpdate();

			if (rows > 0) {
				return StatusUpdateResult.SUCCESS;
			}

			if (getExamById(examId) == null) {
				return StatusUpdateResult.NOT_FOUND;
			}

			return StatusUpdateResult.NO_CHANGE;

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public int totalQuestions(int examId) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT 1 FROM questions WHERE exam_id = ?";
			st = connection.prepareStatement(query);
			st.setInt(1, examId);
			rs = st.executeQuery();

			int questions = 0;
			while (rs.next()) {
				questions++;
			}

			return questions;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return 0;
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

	public List<Exam> getExamsByStatus(String status) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM exams WHERE status = ? ORDER BY created_at DESC";
			st = connection.prepareStatement(query);
			st.setString(1, status);
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

	public int calculateScore(int attemptId) {
		String sql = """
				    SELECT SUM(q.marks)
				    FROM answers a
				    JOIN options o ON a.selected_option_id = o.id
				    JOIN questions q ON a.question_id = q.id
				    WHERE a.attempt_id = ?
				      AND o.is_correct = 1
				""";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, attemptId);
			ResultSet rs = ps.executeQuery();

			if (rs.next())
				return rs.getInt(1);
			return 0;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
