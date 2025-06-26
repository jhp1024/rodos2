package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public abstract class IOVariable {
	@JsonIgnore
	private Enumerate.ComplexType complexType;

	@JacksonXmlProperty(localName = "name")
	private String name;

	@JacksonXmlProperty(localName = "className")
	private String clsName;

	@JacksonXmlProperty(localName = "complex")
	private String complex;

	@JacksonXmlProperty(localName = "type")
	private String type;

	@JacksonXmlProperty(localName = "value")
	private Values values;

	@JacksonXmlProperty(localName = "unit")
	private String unit;

	@JacksonXmlProperty(localName = "description")
	private String description;

	@JacksonXmlProperty(localName = "inDataType")
	private String inDataType;

	@JacksonXmlProperty(localName = "additionalInfo")
	private List<NameValue> additionalInfo;

	public abstract List<IOVariable> getClassType();

	public IOVariable() {
		values = new Values();
	}

	public Values getValues() {
		return values;
	}

	public void setValues(Values values) {
		this.values = values;
	}

	public void addValue(String value) {
		if (this.values != null) {
			this.values.addItem(value);
		} else {
			this.values = new Values();
			this.values.addItem(value);
		}
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getComplex() {
		return complex;
	}

	public void setComplex(String mComplex) {
		this.complex = mComplex;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getUnit() {
		return unit;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public String getClassName() {
		return clsName;
	}

	public void setClassName(String clsName) {
		this.clsName = clsName;
	}

	public String getInDataType() {
		return this.inDataType;
	}

	public void setInDataType(String inDataType) {
		this.inDataType = inDataType;
	}

	public void setComplexType(String complexType) {
		try {
			this.complexType = Enum.valueOf(Enumerate.ComplexType.class, complexType.toUpperCase());
		} catch (IllegalArgumentException e) {
			this.complexType = Enumerate.ComplexType.NONE;
		}
	}

	public String getComplexType() {
		return this.complexType.toString();
	}

	public void addAdditionalInfo(NameValue namevalue) {
		if (this.additionalInfo != null)
			this.additionalInfo.add(namevalue);
		else {
			this.additionalInfo = new ArrayList<>();
			this.additionalInfo.add(namevalue);
		}
	}

	public List<NameValue> getAdditionalInfo() {
		return this.additionalInfo;
	}
}