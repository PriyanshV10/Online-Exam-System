package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.model.Answer;
import com.exam.util.DBUtil;

public class AnswerDao {

	public void saveAnswer(int attemptId, int questionId, int optionId) {
		String sql = """
				    INSERT INTO answers(attempt_id, question_id, selected_option_id)
				    VALUES (?, ?, ?)
				    ON DUPLICATE KEY UPDATE selected_option_id = VALUES(selected_option_id)
				""";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, attemptId);
			ps.setInt(2, questionId);
			ps.setInt(3, optionId);
			ps.executeUpdate();

		} catch (Exception ignored) {
		}
	}

	public void deleteAnswer(int attemptId, int questionId) {
		String sql = """
				    DELETE FROM answers
				    WHERE attempt_id = ? AND question_id = ?
				""";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, attemptId);
			ps.setInt(2, questionId);
			ps.executeUpdate();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public List<Answer> getAnswers(int attemptId) {
		String sql = "SELECT * FROM answers WHERE attempt_id=?";
		List<Answer> list = new ArrayList<>();

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, attemptId);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Answer a = new Answer();
				a.setAttemptId(attemptId);
				a.setQuestionId(rs.getInt("question_id"));
				a.setOptionId(rs.getInt("selected_option_id"));
				list.add(a);
			}
		} catch (Exception ignored) {
		}

		return list;
	}

	public Integer getSelectedOption(int attemptId, int questionId) {
		String query = "SELECT selected_option_id FROM answers WHERE attempt_id = ? AND question_id = ?";

		try (Connection connection = DBUtil.getConnection();
				PreparedStatement st = connection.prepareStatement(query)) {
			st.setInt(1, attemptId);
			st.setInt(2, questionId);

			ResultSet rs = st.executeQuery();

			return rs.next() ? rs.getInt("selected_option_id") : null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
