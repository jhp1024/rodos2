package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class InOut extends IOVariable {

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "inOut")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<InOut> InOuts;

	@SuppressWarnings("unchecked")
	@Override
	public List<IOVariable> getClassType() {
		if (InOuts != null) {
			List<?> l = InOuts;
			return (List<IOVariable>) l;
		}
		return new ArrayList<>();
	}

	public void setInOuts(List<InOut> nestedInOuts) {
		this.InOuts = nestedInOuts;
	}

	public List<InOut> getInOuts() {
		return this.InOuts;
	}

	public void addNestedInOut(InOut inOut) {
		if (this.InOuts != null) {
			this.InOuts.add(inOut);
		} else {
			this.InOuts = new ArrayList<>();
			this.InOuts.add(inOut);
		}
	}
}
