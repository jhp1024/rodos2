package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.cim.Property;

public class ExeForm {

	@JacksonXmlProperty(localName = "exeFileURL")
	private String exeFileURL;

	@JacksonXmlProperty(localName = "shell")
	private String shell;

	@JacksonXmlProperty(localName = "properties")
	private List<Property> properties;

	public String getExeFileURL() {
		return exeFileURL;
	}

	public void setExeFileURL(String exeFileURL) {
		this.exeFileURL = exeFileURL;
	}

	public String getShell() {
		return shell;
	}

	public void setShell(String shell) {
		this.shell = shell;
	}

	public List<Property> getProperties() {
		return this.properties;
	}

	public void setProperties(List<Property> properties) {
		this.properties = properties;
	}

	public void addProperty(Property property) {
		if (this.properties != null) {
			this.properties.add(property);
		} else {
			this.properties = new ArrayList<>();
			this.properties.add(property);
		}
	}

}
