package com.java.kr.ac.kangwon.rodos.model.cim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class IDnType {

	@JacksonXmlProperty(localName = "IDtype")
	protected String IDtype;

	@JacksonXmlProperty(localName = "ModuleID")
	protected ModuleID moduleID;

	@JacksonXmlProperty(localName = "InformationModelVersion")
	protected String informationModelVersion;

	public String getIDtype() {
		return IDtype;
	}

	public void setIDtype(String mIDtype) {
		this.IDtype = mIDtype;
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
