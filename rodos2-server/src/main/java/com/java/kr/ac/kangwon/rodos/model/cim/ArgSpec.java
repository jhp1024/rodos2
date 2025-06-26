package com.java.kr.ac.kangwon.rodos.model.cim;

import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class ArgSpec {

	private String argType;

	private String argName;

	private Enumerate.InOutType argIO;

	public void setArgType(String argType) {
		this.argType = argType;
	}

	public String getArgType() {
		return argType;
	}

	public void setArgName(String argName) {
		this.argName = argName;
	}

	public String getArgName() {
		return argName;
	}

	public void setArgIO(Enumerate.InOutType argIO) {
		this.argIO = argIO;
	}

	public Enumerate.InOutType getArgIO() {
		return argIO;
	}
}
