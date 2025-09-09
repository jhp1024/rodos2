package com.java.kr.ac.kangwon.rodos.model.sim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Organization {

	@JacksonXmlProperty(localName = "owner")
	private Owner owner;

	@JacksonXmlProperty(localName = "dependency")
	private String dependency;

	public Owner getOwner() {
		return owner;
	}

	public void setOwner(Owner owner) {
		this.owner = owner;
	}

	public String getDependency() {
		return dependency;
	}

	public void setDependency(String dependency) {
		this.dependency = dependency;
	}
}