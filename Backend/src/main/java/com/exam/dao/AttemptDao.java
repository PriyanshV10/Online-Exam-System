package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.exam.model.Attempt;
import com.exam.model.ResultDto;
import com.exam.util.DBUtil;

public class AttemptDao {

	public List<Attempt> getAttemptsByUser(int userId) {
		String sql = """
				    SELECT id, exam_id, score, started_at, submitted_at
				    FROM attempts
				    WHERE user_id = ? AND submitted_at IS NOT NULL
				    ORDER BY submitted_at DESC
				""";

		List<Attempt> list = new ArrayList<>();

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, userId);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				Attempt a = new Attempt();
				a.setId(rs.getInt("id"));
				a.setUserId(userId);
				a.setExamId(rs.getInt("exam_id"));
				a.setScore(rs.getInt("score"));
				a.setStartedAt(rs.getTimestamp("started_at"));
				a.setSubmittedAt(rs.getTimestamp("submitted_at"));
				list.add(a);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public Attempt getAttemptById(int attemptId) {
		String sql = "SELECT * FROM attempts WHERE id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, attemptId);
			ResultSet rs = ps.executeQuery();

			if (!rs.next())
				return null;

			Attempt a = new Attempt();
			a.setId(rs.getInt("id"));
			a.setUserId(rs.getInt("user_id"));
			a.setExamId(rs.getInt("exam_id"));
			a.setScore(rs.getInt("score"));
			a.setStartedAt(rs.getTimestamp("started_at"));
			a.setSubmittedAt(rs.getTimestamp("submitted_at"));
			return a;

		} catch (Exception e) {
			return null;
		}
	}

	public Attempt getAttempt(int userId, int examId) {
		String query = "SELECT * FROM attempts WHERE user_id = ? AND exam_id = ?";
		try (Connection connection = DBUtil.getConnection();
				PreparedStatement st = connection.prepareStatement(query)) {

			st.setInt(1, userId);
			st.setInt(2, examId);
			ResultSet rs = st.executeQuery();

			if (rs.next()) {
				Attempt a = new Attempt();

				a.setId(rs.getInt("id"));
				a.setUserId(rs.getInt("user_id"));
				a.setExamId(rs.getInt("exam_id"));
				a.setScore(rs.getInt("score"));
				a.setStartedAt(rs.getTimestamp("started_at"));
				a.setSubmittedAt(rs.getTimestamp("submitted_at"));

				return a;
			}

			return null;

		} catch (Exception e) {
			return null;
		}
	}

	public int startAttempt(int userId, int examId) {
		Timestamp now = Timestamp.from(Instant.now());
		
		String sql = "INSERT INTO attempts (user_id, exam_id, started_at) VALUES (?, ?, ?)";

		try (Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

			ps.setInt(1, userId);
			ps.setInt(2, examId);
			ps.setTimestamp(3, now);
			ps.executeUpdate();

			ResultSet rs = ps.getGeneratedKeys();
			if (rs.next())
				return rs.getInt(1);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

	public void submitAttempt(int attemptId, int score) {
		String sql = "UPDATE attempts SET score=?, submitted_at=NOW() WHERE id=?";
		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, score);
			ps.setInt(2, attemptId);
			ps.executeUpdate();

		} catch (Exception ignored) {
		}
	}

	public void submitAttempt(int attemptId, int score, Timestamp submittedAt) {
		String sql = """
				    UPDATE attempts
				    SET score = ?, submitted_at = ?
				    WHERE id = ? AND submitted_at IS NULL
				""";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, score);
			ps.setTimestamp(2, submittedAt);
			ps.setInt(3, attemptId);
			ps.executeUpdate();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public List<ResultDto> getResultsByUser(int userId) {
		String sql = """
				    SELECT
				        a.id            AS attempt_id,
				        e.id            AS exam_id,
				        e.title         AS exam_title,
				        a.score         AS score,
				        e.total_marks  AS total_marks,
				        a.submitted_at AS submitted_at
				    FROM attempts a
				    JOIN exams e ON a.exam_id = e.id
				    WHERE a.user_id = ?
				      AND a.submitted_at IS NOT NULL
				    ORDER BY a.submitted_at DESC
				""";

		List<ResultDto> results = new ArrayList<>();

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, userId);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				ResultDto dto = new ResultDto();

				dto.setAttemptId(rs.getInt("attempt_id"));
				dto.setExamId(rs.getInt("exam_id"));
				dto.setExamTitle(rs.getString("exam_title"));

				int score = rs.getInt("score");
				int totalMarks = rs.getInt("total_marks");

				dto.setScore(score);
				dto.setTotalMarks(totalMarks);

				double percentage = totalMarks == 0 ? 0 : (score * 100.0) / totalMarks;
				dto.setPercentage(percentage);

				dto.setSubmittedAt(rs.getTimestamp("submitted_at"));

				results.add(dto);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return results;
	}

}
