package com.java.kr.ac.kangwon.rodos.model.sim;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class CompilerType {

	@JacksonXmlProperty(localName = "osName")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String osName;

	@JacksonXmlProperty(localName = "verRangeOS")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private RangeString verRangeOS;

	@JacksonXmlProperty(localName = "compilerName")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String compilerName;

	@JacksonXmlProperty(localName = "verRangeCompiler")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private RangeString verRangeCompiler;

	@JacksonXmlProperty(localName = "bitsnCPUarch")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private String bitsnCPUarch;

	public String getOSName() {
		return osName;
	}

	public void setOSName(String osName) {
		this.osName = osName;
	}

	public String getBitsnCPUarch() {
		return bitsnCPUarch;
	}

	public void setBitsnCPUarch(String bitsnCPUarch) {
		this.bitsnCPUarch = bitsnCPUarch;
	}

	public RangeString getVerRangeCompiler() {
		return verRangeCompiler;
	}

	public void setVerRangeCompiler(RangeString verRangeCompiler) {
		this.verRangeCompiler = verRangeCompiler;
	}

	public RangeString getVerRangeOS() {
		return verRangeOS;
	}

	public void setVerRangeOS(RangeString verRangeOS) {
		this.verRangeOS = verRangeOS;
	}

	public String getCompilerName() {
		return compilerName;
	}

	public void setCompilerName(String compilerName) {
		this.compilerName = compilerName;
	}
}
