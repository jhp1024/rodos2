package com.java.kr.ac.kangwon.rodos.model.sim;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.java.kr.ac.kangwon.rodos.model.cim.GenInfo;
import com.java.kr.ac.kangwon.rodos.model.cim.IOVariables;
import com.java.kr.ac.kangwon.rodos.model.cim.SafeSecure;
import com.java.kr.ac.kangwon.rodos.model.cim.Services;

@JacksonXmlRootElement(localName = "Module")
public class SoftwareModule {

	@JacksonXmlProperty(isAttribute = true)
	private String type = "SIM";

	@JsonIgnore
	public boolean isSafety, isSecurity;
	@JsonIgnore
	public boolean isHw, isSw;
	@JsonIgnore
	public boolean isTool;

	@JsonIgnore
	public String[] complexList;

	@JacksonXmlProperty(localName = "GenInfo")
	private GenInfo genInfo;

	@JacksonXmlProperty(localName = "IDnType")
	private SWIDnType idnType;

	@JacksonXmlProperty(localName = "Properties")
	private Properties properties;

	@JacksonXmlProperty(localName = "IOVariables")
	private IOVariables ioVariables;

	@JacksonXmlProperty(localName = "Services")
	private Services services;

	@JacksonXmlProperty(localName = "Infrastructure")
	private Infrastructure infrastructure;

	@JacksonXmlProperty(localName = "SafeSecure")
	private SafeSecure safeSecure;

	@JacksonXmlProperty(localName = "Modelling")
	private Modelling modelling;

	@JacksonXmlProperty(localName = "ExecutableForm")
	private ExecutableForm executableForm;

	public SoftwareModule() {
		genInfo = new GenInfo();
		idnType = new SWIDnType();
		properties = new Properties();
		ioVariables = new IOVariables();
		infrastructure = new Infrastructure();
		executableForm = new ExecutableForm();
	}

	public GenInfo getGenInfo() {
		return genInfo;
	}

	public void setGenInfo(GenInfo genInfo) {
		this.genInfo = genInfo;
	}

	public void setInfoList() {
		this.complexList = new String[] { "None", "array", "class", "pointer", "vector" };
	}

	public SWIDnType getIdnType() {
		return idnType;
	}

	public void setIdnType(SWIDnType idnType) {
		this.idnType = idnType;
	}

	public Properties getProperties() {
		return properties;
	}

	public void setProperties(Properties properties) {
		this.properties = properties;
	}

	public IOVariables getIoVariables() {
		return ioVariables;
	}

	public void setIoVariables(IOVariables ioVariables) {
		this.ioVariables = ioVariables;
	}

	public Infrastructure getInfrastructure() {
		return infrastructure;
	}

	public void setInfrastructure(Infrastructure infrastructure) {
		this.infrastructure = infrastructure;
	}

	public ExecutableForm getExecutableForm() {
		return executableForm;
	}

	public void setExecutableForm(ExecutableForm executableForm) {
		this.executableForm = executableForm;
	}
}
