package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class ServiceMethod {

	private String methodName;

	private List<ArgSpec> argSpecs;

	private String retType;

	private Enumerate.MOType MOType;

	private Enumerate.ReqProvType reqProvType;

	public ServiceMethod() {
		argSpecs = new ArrayList<>();
	}

	public void setMethodName(String name) {
		this.methodName = name;
	}

	public String getMethodName() {
		return methodName;
	}

	public void setMOType(Enumerate.MOType moType) {
		this.MOType = moType;
	}

	public Enumerate.MOType getMOType() {
		return this.MOType;
	}

	public void addArgSpec(ArgSpec argSpec) {
		if (this.argSpecs != null) {
			this.argSpecs.add(argSpec);
		} else {
			this.argSpecs = new ArrayList<>();
			this.argSpecs.add(argSpec);
		}
	}

	public List<ArgSpec> getArgSpecs() {
		return this.argSpecs;
	}

	public String getRetType() {
		return retType;
	}

	public void setRetType(String retType) {
		this.retType = retType;
	}

	public Enumerate.ReqProvType getReqProvType() {
		return reqProvType;
	}

	public void setReqProvType(Enumerate.ReqProvType reqProvType) {
		this.reqProvType = reqProvType;
	}

}
