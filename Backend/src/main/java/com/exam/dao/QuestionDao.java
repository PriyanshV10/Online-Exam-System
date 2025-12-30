package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.exam.model.Question;
import com.exam.util.DBUtil;

public class QuestionDao {

	public int addQuestion(int examId, String text, int marks, Map<Character, String> options, char correctOption) {
		String qSql = "INSERT INTO questions (exam_id, question_text, marks) VALUES (?, ?, ?)";
		String oSql = "INSERT INTO options (question_id, option_label, option_text, is_correct) VALUES (?, ?, ?, ?)";

		try (Connection con = DBUtil.getConnection();
				PreparedStatement qPs = con.prepareStatement(qSql, PreparedStatement.RETURN_GENERATED_KEYS)) {

			qPs.setInt(1, examId);
			qPs.setString(2, text);
			qPs.setInt(3, marks);
			qPs.executeUpdate();

			ResultSet rs = qPs.getGeneratedKeys();
			if (!rs.next())
				return -1;

			int questionId = rs.getInt(1);

			try (PreparedStatement oPs = con.prepareStatement(oSql)) {
				for (Map.Entry<Character, String> entry : options.entrySet()) {
					oPs.setInt(1, questionId);
					oPs.setString(2, entry.getKey().toString());
					oPs.setString(3, entry.getValue());
					oPs.setBoolean(4, entry.getKey() == correctOption);
					oPs.addBatch();
				}
				oPs.executeBatch();
			}

			return questionId;

		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}

	public boolean updateQuestion(int questionId, String text, int marks, Map<Character, String> options,
			char correctOption) {

		String updateQuestion = "UPDATE questions SET question_text = ?, marks = ? WHERE id = ?";
		String deleteOptions = "DELETE FROM options WHERE question_id = ?";
		String insertOption = "INSERT INTO options (question_id, option_label, option_text, is_correct) "
				+ "VALUES (?, ?, ?, ?)";

		try (Connection con = DBUtil.getConnection()) {
			con.setAutoCommit(false); // START TRANSACTION

			try (PreparedStatement stUpdate = con.prepareStatement(updateQuestion);
					PreparedStatement stDelete = con.prepareStatement(deleteOptions);
					PreparedStatement stInsert = con.prepareStatement(insertOption)) {

				// 1️. Update question
				stUpdate.setString(1, text);
				stUpdate.setInt(2, marks);
				stUpdate.setInt(3, questionId);

				if (stUpdate.executeUpdate() != 1) {
					con.rollback();
					return false;
				}

				// 2️. Delete old options
				stDelete.setInt(1, questionId);
				stDelete.executeUpdate();

				// 3️. Insert new options
				for (Map.Entry<Character, String> entry : options.entrySet()) {
					stInsert.setInt(1, questionId);
					stInsert.setString(2, entry.getKey().toString());
					stInsert.setString(3, entry.getValue());
					stInsert.setBoolean(4, entry.getKey() == correctOption);
					stInsert.addBatch();
				}
				stInsert.executeBatch();

				con.commit(); // SUCCESS
				return true;

			} catch (Exception e) {
				con.rollback(); // FAILURE → rollback
				throw e;
			}

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean deleteQuestions(int examId) {
		String query = "DELETE FROM questions WHERE exam_id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement st = con.prepareStatement(query);) {
			st.setInt(1, examId);
			return st.executeUpdate() == 1;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean deleteQuestion(int questionId) {
		String query = "DELETE FROM questions WHERE id = ?";
		
		try (Connection con = DBUtil.getConnection(); PreparedStatement st = con.prepareStatement(query);) {
			st.setInt(1, questionId);
			return st.executeUpdate() == 1;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public Question getQuestionById(int questionId) {
		String query = "SELECT * FROM questions WHERE id = ?";

		try (Connection connection = DBUtil.getConnection();
				PreparedStatement st = connection.prepareStatement(query)) {
			st.setInt(1, questionId);
			ResultSet rs = st.executeQuery();
			
			if(rs.next()) {
				Question question = new Question();
				
				question.setId(rs.getInt("id"));;
				question.setExamId(rs.getInt("exam_id"));
				question.setText(rs.getString("question_text"));
				question.setMarks(rs.getInt("marks"));
				
				return question;
			}
			
			return null;			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public List<Question> getQuestionsByExamId(int examId) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM questions WHERE exam_id = ?";
			st = connection.prepareStatement(query);
			st.setInt(1, examId);

			rs = st.executeQuery();

			List<Question> list = new ArrayList<>();
			while (rs.next()) {
				Question question = new Question();

				question.setId(rs.getInt("id"));
				question.setExamId(rs.getInt("exam_id"));
				question.setText(rs.getString("question_text"));
				question.setMarks(rs.getInt("marks"));

				list.add(question);
			}

			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			DBUtil.closeResources(connection, st, null);
		}
	}

	public int getTotalMarks(int examId) {
		String query = "SELECT COALESCE(SUM(marks), 0) FROM questions WHERE exam_id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement st = con.prepareStatement(query)) {
			st.setInt(1, examId);

			ResultSet rs = st.executeQuery();
			if (rs.next()) {
				return rs.getInt(1);
			}
			return 0;

		} catch (Exception e) {
			e.printStackTrace();
			return 0;
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

	public int getMarks(int id) {
		String query = "SELECT marks FROM questions WHERE id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement st = con.prepareStatement(query)) {
			st.setInt(1, id);

			ResultSet rs = st.executeQuery();
			if (rs.next()) {
				return rs.getInt(1);
			}
			return 0;

		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

}
