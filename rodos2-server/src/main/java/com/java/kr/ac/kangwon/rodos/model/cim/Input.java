package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

public class Input extends IOVariable {

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "inputs")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<Input> inputs;

	@SuppressWarnings("unchecked")
	@Override
	public List<IOVariable> getClassType() {
		if (inputs != null) {
			List<?> l = inputs;
			return (List<IOVariable>) l;
		}
		return new ArrayList<>();
	}

	public void setInputs(List<Input> nestedInputs) {
		this.inputs = nestedInputs;
	}

	public List<Input> getInputs() {
		return this.inputs;
	}

	public void addNestedInput(Input input) {
		if (this.inputs != null) {
			this.inputs.add(input);
		} else {
			this.inputs = new ArrayList<>();
			this.inputs.add(input);
		}
	}
}
