package com.java.kr.ac.kangwon.rodos.model.cim;

import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class Security {

	private Enumerate.SecurityType type;

	private Enumerate.CybSecurityLevel value;

	public String getType() {
		return type.toString();
	}

	public void setType(String type) {
		this.type = Enum.valueOf(Enumerate.SecurityType.class, type);
	}

	public void setValue(String overallPhySecurityLevel) {
		this.value = Enum.valueOf(Enumerate.CybSecurityLevel.class, "_" + overallPhySecurityLevel);
	}

	public String getValue() {
		return value.toString().split("_")[1];
	}

}
