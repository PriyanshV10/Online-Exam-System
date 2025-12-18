package com.exam.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtil {
	static final String URL = "jdbc:mysql://localhost:3306/exam_system?useSSL=false&serverTimezone=UTC";
	static final String USERNAME = "root";
	static final String PASSWORD = "admin";

	public static Connection getConnection() throws ClassNotFoundException, SQLException {
		Class.forName("com.mysql.cj.jdbc.Driver");
		return DriverManager.getConnection(URL, USERNAME, PASSWORD);
	}
	
	public static void closeResources(Connection connection, Statement st, ResultSet rs){
		try {
			if(connection != null) connection.close();
			if(st != null) st.close();
			if(rs != null) rs.close();			
		} catch (Exception e) {
			// TODO: handle exception
		}
	}

}
