package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class Property {

	@JacksonXmlProperty(localName = "complexType")
	private Enumerate.ComplexType complexType;

	@JacksonXmlProperty(localName = "name")
	private String name;

	private String complex;

	@JacksonXmlProperty(localName = "complexName")
	private String complexName;

	@JacksonXmlProperty(localName = "type")
	private String type;

	@JacksonXmlProperty(localName = "unit")
	private String unit;

	@JacksonXmlProperty(localName = "description")
	private String description;

	@JacksonXmlProperty(localName = "values")
	private Values values;

	// Property 리스트를 XML에서 처리
	@JacksonXmlElementWrapper(useWrapping = false) // 래퍼 엘리먼트 없이
	@JacksonXmlProperty(localName = "property") // 각 항목을 "property"로
	@JsonInclude(JsonInclude.Include.NON_EMPTY) // 빈 리스트는 제외
	public List<Property> properties;

	public Property() {
		this.values = new Values();
	}

	public List<Property> getProperties() {
		return properties;
	}

	public void setProperties(List<Property> properties) {
		this.properties = properties;
	}

	public void addProperty(Property property) {
		if (this.properties != null)
			this.properties.add(property);
		else {
			this.properties = new ArrayList<>();
			this.properties.add(property);
		}
	}

	public void setValues(Values values) {
		this.values = values;
	}

	public Values getValues() {
		return values;
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

	public String getComplexName() {
		return complexName;
	}

	public void setComplexName(String complexName) {
		this.complexName = complexName;
	}

	public String getComplexType() {
		return complexType.toString();
	}

	@Override
	public String toString() {
		String property;
		if (complexName == null)
			property = name + ", " + type + ", " + description;
		else
			property = "(" + complexName + ") " + name + ", " + type + ", " + description;
		return property;
	}

	public void setComplexType(String complexType) {
		try {
			this.complexType = Enum.valueOf(Enumerate.ComplexType.class, complexType.toUpperCase());
		} catch (IllegalArgumentException e) {
			this.complexType = Enumerate.ComplexType.NONE;
		}
	}
}