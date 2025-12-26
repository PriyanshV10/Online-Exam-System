package com.exam.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.exam.model.User;
import com.exam.util.DBUtil;

public class UserDao {
	
	public List<User> getAllUsers() {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		
		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM users WHERE role = \"STUDENT\" ORDER BY created_at DESC";
			st = connection.prepareStatement(query);
			rs = st.executeQuery();
			
			List<User> list = new ArrayList<>();
			while(rs.next()) {
				User user = new User();
				user.setId(rs.getInt("id"));
				user.setName(rs.getString("name"));
				user.setEmail(rs.getString("email"));
				user.setRole(rs.getString("role"));				
				user.setStatus(rs.getString("status"));
				
				list.add(user);
			}
			
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
			return new ArrayList<>();
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}

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

			if (rs.next()) {
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

	public void createUser(String name, String email, String password, String role, String status) {
		Connection connection = null;
		PreparedStatement st = null;

		try {
			connection = DBUtil.getConnection();
			String query = "INSERT INTO users (name, email, password, role, status) VALUES(?, ?, ?, ?, ?)";
			st = connection.prepareStatement(query);
			st.setString(1, name);
			st.setString(2, email);
			st.setString(3, password);
			st.setString(4, role);
			st.setString(5, status);

			st.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
		} finally {
			DBUtil.closeResources(connection, st, null);
		}
	}
	
	public List<User> getUsersByStatus(String status) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;
		
		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM users WHERE role = \"STUDENT\" AND status = ?";
			st = connection.prepareStatement(query);
			st.setString(1, status);
			rs = st.executeQuery();
			
			List<User> list = new ArrayList<>();
			while(rs.next()) {
				User user = new User();
				user.setId(rs.getInt("id"));
				user.setName(rs.getString("name"));
				user.setEmail(rs.getString("email"));
				user.setRole(rs.getString("role"));				
				user.setStatus(rs.getString("status"));
				
				list.add(user);
			}
			
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
			return new ArrayList<>();
		} finally {
			DBUtil.closeResources(connection, st, rs);
		}
	}
	
	public boolean updateUserStatus(int userId, String status) {
		Connection connection = null;
		PreparedStatement st = null;
		
		try {
			connection = DBUtil.getConnection();
			String query = "UPDATE users SET status = ? WHERE id = ?";
			st = connection.prepareStatement(query);
			
			st.setString(1, status);
			st.setInt(2, userId);
			
			int rows = st.executeUpdate();
			return rows > 0;
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
			return false;
		} finally {
			DBUtil.closeResources(connection, st, null);
		}
	}
	
	public User findById(int userId) {
		Connection connection = null;
		PreparedStatement st = null;
		ResultSet rs = null;

		try {
			connection = DBUtil.getConnection();
			String query = "SELECT * FROM users WHERE id = ?";
			st = connection.prepareStatement(query);
			st.setInt(1, userId);
			rs = st.executeQuery();

			if (rs.next()) {
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

}
