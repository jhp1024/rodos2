package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.cim.Property;

public class Properties {

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "Property")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<Property> properties;

	@JacksonXmlProperty(localName = "OSType")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public OSType osType;

	@JacksonXmlProperty(localName = "CompilerType")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public CompilerType compilerType;

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "ExecutionType")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	public List<ExecutionType> executionTypes;

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "Library")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<Library> libraries;

	// Prevent duplicate serialization
	@JsonIgnore
	public OSType ostype;

	public Properties() {
		osType = new OSType();
		compilerType = new CompilerType();
	}

	public void addProperty(Property property) {
		if (this.properties != null)
			this.properties.add(property);
		else {
			this.properties = new ArrayList<>();
			this.properties.add(property);
		}
	}

	public void setProperties(List<Property> properties) {
		this.properties = properties;
	}

	public List<Property> getProperties() {
		return this.properties;
	}

	public List<Library> getLibraries() {
		return this.libraries;
	}

	public void addLibrary(Library library) {
		if (this.libraries != null)
			this.libraries.add(library);
		else {
			this.libraries = new ArrayList<>();
			this.libraries.add(library);
		}
	}

	public void addExecutionType(ExecutionType executionType) {
		if (this.executionTypes != null)
			this.executionTypes.add(executionType);
		else {
			this.executionTypes = new ArrayList<>();
			this.executionTypes.add(executionType);
		}
	}

	public List<ExecutionType> getExecutionTypes() {
		return executionTypes;
	}

	public void setExecutionTypes(List<ExecutionType> executionTypes) {
		this.executionTypes = executionTypes;
	}

	public CompilerType getCompilerType() {
		return compilerType;
	}

	public void setCompilerType(CompilerType compilerType) {
		this.compilerType = compilerType;
	}

	@JsonIgnore
	public OSType getOSType() {
		return osType;
	}

	public void setOSType(OSType osType) {
		this.osType = osType;
	}
}