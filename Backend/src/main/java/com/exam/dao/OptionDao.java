package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.model.Option;
import com.exam.util.DBUtil;

public class OptionDao {

    public List<Option> getOptionsByQuestionId(int questionId) {
        String sql = "SELECT option_label, option_text, is_correct FROM options WHERE question_id = ?";

        try (Connection con = DBUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

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
}
