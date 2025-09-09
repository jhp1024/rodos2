package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Output extends IOVariable {

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "output")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<Output> outputs;

	@SuppressWarnings("unchecked")
	@Override
	public List<IOVariable> getClassType() {
		if (outputs != null) {
			List<?> l = outputs;
			return (List<IOVariable>) l;
		}
		return new ArrayList<>();
	}

	public void setOutputs(List<Output> nestedOutputs) {
		this.outputs = nestedOutputs;
	}

	public List<Output> getOutputs() {
		return this.outputs;
	}

	public void addNestedOutput(Output output) {
		if (this.outputs != null) {
			this.outputs.add(output);
		} else {
			this.outputs = new ArrayList<>();
			this.outputs.add(output);
		}
	}
}
