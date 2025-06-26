package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.cim.IDnType;

public class SWIDnType extends IDnType {

	@JacksonXmlProperty(localName = "SWAspects")
	public List<String> swAspects;

	public SWIDnType() {
	}

	public List<String> getSWList() {
		return this.swAspects;
	}

	public void addModuleIdToSWList(String moduleId) {
		if (this.swAspects != null) {
			this.swAspects.add(moduleId);
		} else {
			this.swAspects = new ArrayList<>();
			this.swAspects.add(moduleId);
		}
	}
}
