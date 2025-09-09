package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class SafeSecure {

	@JacksonXmlProperty(localName = "Safety")
	private Safety safety;

	@JacksonXmlProperty(localName = "Security")
	private Security security;

	private Enumerate.PLSILType overallValidSafetyLevelType;

	private Enumerate.SafetyLevelPL overallSafetyLevelPL;

	private Enumerate.SafetyLevelSIL overallSafetyLevelSIL;

	private Enumerate.PhySecurityLevel overallPhySecurityLevel;

	private Enumerate.CybSecurityLevel overallCybSecurityLevel;

	private List<SafetyFunction> safetyFunction;

	private List<Security> inCybSecurityLevel;

	private List<NameValue> additionalInfo;

	public void addAdditionalInfo(NameValue namevalue) {
		if (this.additionalInfo != null)
			this.additionalInfo.add(namevalue);
		else {
			this.additionalInfo = new ArrayList<>();
			this.additionalInfo.add(namevalue);
		}
	}

	public List<NameValue> getAdditionalInfo() {
		return this.additionalInfo;
	}

	public String getOverallValidSafetyLevelType() {
		if (overallValidSafetyLevelType != null)
			return overallValidSafetyLevelType.toString();
		else
			return "";
	}

	public void setOverallValidSafetyLevelType(String overallValidSafetyLevelType) {
		this.overallValidSafetyLevelType = Enum.valueOf(Enumerate.PLSILType.class, overallValidSafetyLevelType);
	}

	public String getOverallSafetyLevelPL() {
		if (overallSafetyLevelPL != null)
			return overallSafetyLevelPL.toString();
		else
			return "";
	}

	public void setOverallSafetyLevelPL(String overallSafetyLevelPL) {
		if (!overallSafetyLevelPL.isEmpty())
			this.overallSafetyLevelPL = Enum.valueOf(Enumerate.SafetyLevelPL.class, overallSafetyLevelPL);
		else
			this.overallSafetyLevelPL = null;
	}

	public String getOverallSafetyLevelSIL() {
		if (overallSafetyLevelSIL != null)
			return overallSafetyLevelSIL.toString().split("_")[1];
		else
			return "";
	}

	public void setOverallSafetyLevelSIL(String overallsaSafetyLevelSIL) {
		if (!overallsaSafetyLevelSIL.isEmpty())
			this.overallSafetyLevelSIL = Enum.valueOf(Enumerate.SafetyLevelSIL.class, "_" + overallsaSafetyLevelSIL);
		else
			this.overallSafetyLevelSIL = null;
	}

	public String getOverallPhySecurityLevel() {
		if (overallPhySecurityLevel != null)
			return overallPhySecurityLevel.toString();
		else
			return "";
	}

	public void setOverallPhySecurityLevel(String overallPhySecurityLevel) {
		this.overallPhySecurityLevel = Enum.valueOf(Enumerate.PhySecurityLevel.class, overallPhySecurityLevel);
	}

	public String getOverallCybSecurityLevel() {
		if (overallCybSecurityLevel != null)
			return overallCybSecurityLevel.toString().split("_")[1];
		else
			return "";
	}

	public void setOverallCybSecurityLevel(String overallCybSecurityLevel) {
		this.overallCybSecurityLevel = Enum.valueOf(Enumerate.CybSecurityLevel.class, "_" + overallCybSecurityLevel);
	}

	public List<SafetyFunction> getInSafetyLevel() {
		return this.safetyFunction;
	}

	public void setSafetyFunction(List<SafetyFunction> safetyFunction) {
		this.safetyFunction = safetyFunction;
	}

	public void addSafetyFunction(SafetyFunction safetyFunction) {
		if (this.safetyFunction != null)
			this.safetyFunction.add(safetyFunction);
		else {
			this.safetyFunction = new ArrayList<>();
			this.safetyFunction.add(safetyFunction);
		}
	}

	public List<Security> getInCybSecurityLevel() {
		return this.inCybSecurityLevel;
	}

	public void setInCybSecurityLevel(List<Security> inCybSecurityLevel) {
		this.inCybSecurityLevel = inCybSecurityLevel;
	}

	public void addCybSecurity(Security cybSecurity) {
		if (this.inCybSecurityLevel != null)
			this.inCybSecurityLevel.add(cybSecurity);
		else {
			this.inCybSecurityLevel = new ArrayList<>();
			this.inCybSecurityLevel.add(cybSecurity);
		}
	}
}