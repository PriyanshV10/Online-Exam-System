package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.exam.model.Question;
import com.exam.util.DBUtil;

public class QuestionDao {
	
	public int addQuestion(int examId, String text, int marks) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		
		try {
			connection = DBUtil.getConnection();
			String query = "INSERT INTO questions (exam_id, question_text, marks) VALUES(?, ?, ?)";
			st = connection.prepareStatement(query);
			
			st.setInt(1, examId);
			st.setString(2, text);
			st.setInt(3, marks);
			
			st.executeUpdate();
			
			rs = st.getGeneratedKeys();
			if (rs.next()) {
				return rs.getInt(1);
			}

			return -1;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return -1;
		} finally {
			DBUtil.closeResources(connection, st, null);
		}
	}
	
}
