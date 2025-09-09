package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.cim.IDnType;
import com.java.kr.ac.kangwon.rodos.model.cim.ModuleID;

public class SWIDnType extends IDnType {

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "SWAspects")
	private List<ModuleID> mSWAspects;

	public SWIDnType() {
		mSWAspects = new ArrayList<>();
	}

	public List<ModuleID> getSWAspects() {
		return mSWAspects;
	}

	public void setSWAspects(List<ModuleID> swAspects) {
		this.mSWAspects = swAspects;
	}

	public void addModuleIDToSWAspects(ModuleID moduleId) {
		if (this.mSWAspects != null)
			this.mSWAspects.add(moduleId);
		else {
			this.mSWAspects = new ArrayList<>();
			this.mSWAspects.add(moduleId);
		}
	}
}
