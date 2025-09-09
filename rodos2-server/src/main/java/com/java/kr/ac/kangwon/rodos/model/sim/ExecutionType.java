package com.java.kr.ac.kangwon.rodos.model.sim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class ExecutionType {

	@JacksonXmlProperty(localName = "priority")
	private String priority;

	@JacksonXmlProperty(localName = "optype")
	private Enumerate.OpTypes opType;

	@JacksonXmlProperty(localName = "hardRT")
	private String hardRT;

	@JacksonXmlProperty(localName = "timeConstraint")
	private String timeConstraint;

	@JacksonXmlProperty(localName = "instanceType")
	private Enumerate.InstanceTypes instanceType;

	public ExecutionType(String priority, Enumerate.OpTypes opType, String hardRT, String timeConstraint,
			Enumerate.InstanceTypes instanceType) {
		this.priority = priority;
		this.opType = opType;
		this.hardRT = hardRT;
		this.timeConstraint = timeConstraint;
		this.instanceType = instanceType;
	}

	public ExecutionType() {
	}

	public Enumerate.OpTypes getOPType() {
		return opType;
	}

	public Enumerate.InstanceTypes getInstanceType() {
		return instanceType;
	}

	public void setInstanceType(Enumerate.InstanceTypes mInstanceType) {
		this.instanceType = mInstanceType;
	}

	public String getTimeConstraint() {
		return timeConstraint;
	}

	public void setTimeConstraint(String mTimeConstraint) {
		this.timeConstraint = mTimeConstraint;
	}

	public String getHardRT() {
		return hardRT;
	}

	public void setHardRT(String mHardRT) {
		this.hardRT = mHardRT;
	}

	public void setOPType(Enumerate.OpTypes mOPType) {
		this.opType = mOPType;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}
}
