package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Services {

	@JacksonXmlProperty(localName = "NoOfBasicService")
	private String noOfBasicService;

	@JacksonXmlProperty(localName = "NoOfOptionalService")
	private String noOfOptionalService;

	@JacksonXmlElementWrapper(localName = "serviceProfile")
	@JacksonXmlProperty(localName = "item")
	private List<ServiceProfile> serviceProfiles;

	public List<ServiceProfile> getServiceProfiles() {
		return this.serviceProfiles;
	}

	public void addServiceProfile(ServiceProfile serviceProfile) {
		if (this.serviceProfiles != null) {
			this.serviceProfiles.add(serviceProfile);
		} else {
			this.serviceProfiles = new ArrayList<>();
			this.serviceProfiles.add(serviceProfile);
		}
	}

	public String getNoOfOptionalService() {
		return noOfOptionalService;
	}

	public void setNoOfOptionalService(String noOfOptionalService) {
		this.noOfOptionalService = noOfOptionalService;
	}

	public String getNoOfBasicService() {
		return noOfBasicService;
	}

	public void setNoOfBasicService(String noOfBasicService) {
		this.noOfBasicService = noOfBasicService;
	}
}
