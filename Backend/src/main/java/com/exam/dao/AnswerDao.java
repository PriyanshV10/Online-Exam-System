package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.model.Answer;
import com.exam.model.ResultAnswer;
import com.exam.util.DBUtil;

public class AnswerDao {

	public List<ResultAnswer> getResultAnswers(int attemptId) {
		String sql = """
				    SELECT q.question_text,
				           o.option_text,
				           o.is_correct
				    FROM answers a
				    JOIN questions q ON q.id = a.question_id
				    JOIN options o ON o.id = a.selected_option_id
				    WHERE a.attempt_id = ?
				""";

		List<ResultAnswer> list = new ArrayList<>();

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, attemptId);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				ResultAnswer ra = new ResultAnswer();
				ra.setQuestion(rs.getString("question_text"));
				ra.setSelectedOption(rs.getString("option_text"));
				ra.setCorrect(rs.getBoolean("is_correct"));
				list.add(ra);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

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
}
