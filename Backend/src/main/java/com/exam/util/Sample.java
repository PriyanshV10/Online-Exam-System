package com.exam.util;

import org.mindrot.jbcrypt.BCrypt;

public class Sample {
	
	public static void main(String[] args) {
		String s = BCrypt.hashpw("admin", BCrypt.gensalt());
		System.out.println(s);
	}
}
