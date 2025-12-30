package com.exam.util;

public class TimeUtil {
	private static final long IST_OFFSET_MILLIS = 5L * 60 * 60 * 1000 + 30L * 60 * 1000;
	
	public static long getCurrentTime() {
		return System.currentTimeMillis() + IST_OFFSET_MILLIS;
	}
}
