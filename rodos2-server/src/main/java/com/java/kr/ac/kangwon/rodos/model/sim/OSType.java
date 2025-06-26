package com.java.kr.ac.kangwon.rodos.model.sim;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.Enumerate.NoBit;

public class OSType {

	@JacksonXmlProperty(localName = "type")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String type;

	@JacksonXmlProperty(localName = "bit")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private NoBit bit;

	@JacksonXmlProperty(localName = "version")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String version;

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getVersion() {
		return version;
	}

	public void setBits(NoBit bit) {
		this.bit = bit;
	}

	public NoBit getBit() {
		return bit;
	}
}
