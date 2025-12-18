package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.exam.model.User;
import com.exam.util.DBUtil;

public class UserDao {
	
	public User findByEmail(String email) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		
		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM users WHERE email = ?";
			st = connection.prepareStatement(query);
			st.setString(1, email);
			rs = st.executeQuery();
			
			if(rs.next()) {
				User user = new User();

				user.setId(rs.getInt("id"));
				user.setName(rs.getString("name"));
				user.setEmail(rs.getString("email"));
				user.setPassword(rs.getString("password"));
				user.setRole(rs.getString("role"));
				user.setStatus(rs.getString("status"));
				
				return user;
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

	public boolean emailExists(String email) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT 1 FROM users WHERE email = ?";
			st = connection.prepareStatement(query);
			st.setString(1, email);
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

}
