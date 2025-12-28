package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.model.Option;
import com.exam.util.DBUtil;

public class OptionDao {

	public boolean deleteOptions(int questionId) {
		String query = "DELETE FROM options WHERE question_id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement st = con.prepareStatement(query);) {
			st.setInt(1, questionId);
			return st.executeUpdate() == 1;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean isCorrect(int optionId) {
		String sql = "SELECT is_correct FROM options WHERE id=?";
		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, optionId);
			ResultSet rs = ps.executeQuery();
			return rs.next() && rs.getBoolean(1);

		} catch (Exception e) {
			return false;
		}
	}

	public List<Option> getOptionsByQuestionId(int questionId) {
		String sql = "SELECT option_label, option_text, is_correct FROM options WHERE question_id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, questionId);
			ResultSet rs = ps.executeQuery();

			List<Option> list = new ArrayList<>();
			while (rs.next()) {
				Option option = new Option();
				option.setLabel(rs.getString("option_label").charAt(0));
				option.setText(rs.getString("option_text"));
				option.setCorrect(rs.getBoolean("is_correct"));
				list.add(option);
			}
			return list;

		} catch (Exception e) {
			e.printStackTrace();
			return List.of();
		}
	}

	public List<Option> getOptionsForStudent(int questionId) {
		String sql = "SELECT id, option_label, option_text FROM options WHERE question_id = ?";

		try (Connection con = DBUtil.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {

			ps.setInt(1, questionId);
			ResultSet rs = ps.executeQuery();

			List<Option> list = new ArrayList<>();
			while (rs.next()) {
				Option o = new Option();
				o.setLabel(rs.getString("option_label").charAt(0));
				o.setText(rs.getString("option_text"));
				list.add(o);
			}
			return list;

		} catch (Exception e) {
			e.printStackTrace();
			return List.of();
		}
	}

}
