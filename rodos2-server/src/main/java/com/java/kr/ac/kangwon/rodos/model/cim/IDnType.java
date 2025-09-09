package com.java.kr.ac.kangwon.rodos.model.cim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class IDnType {

	@JacksonXmlProperty(isAttribute = true)
	protected String type;

	@JacksonXmlProperty(localName = "ModuleID")
	protected ModuleID moduleID;

	@JacksonXmlProperty(localName = "informationModelVersion")
	protected String informationModelVersion;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public ModuleID getModuleID() {
		return moduleID;
	}

	public void setModuleID(ModuleID moduleID) {
		this.moduleID = moduleID;
	}

	public String getInformationModelVersion() {
		return informationModelVersion;
	}

	public void setInformationModelVersion(String informationModelVersion) {
		this.informationModelVersion = informationModelVersion;
	}
}
