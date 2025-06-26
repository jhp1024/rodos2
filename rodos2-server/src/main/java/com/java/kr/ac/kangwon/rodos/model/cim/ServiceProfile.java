package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

import com.java.kr.ac.kangwon.rodos.model.Enumerate;

public class ServiceProfile {

	private String type; // IDL, XML

	private String ID;

	private Enumerate.PhysicalVirtual PVType;

	private Enumerate.MOType MOType;

	private String path;

	private List<NameValue> additionalInfo;

	private List<ServiceMethod> serviceMethods;

	public ServiceProfile() {
		additionalInfo = new ArrayList<>();
		serviceMethods = new ArrayList<>();
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setID(String ID) {
		this.ID = ID;
	}

	public String getID() {
		return ID;
	}

	public void setPVType(Enumerate.PhysicalVirtual pvType) {
		this.PVType = pvType;
	}

	public Enumerate.PhysicalVirtual getPVType() {
		return PVType;
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

	public void setMOType(Enumerate.MOType moType) {
		this.MOType = moType;
	}

	public Enumerate.MOType getMOType() {
		return MOType;
	}

	public List<ServiceMethod> getServiceMethods() {
		return this.serviceMethods;
	}

	public void addServiceMethod(ServiceMethod serviceMethod) {
		if (this.serviceMethods != null) {
			this.serviceMethods.add(serviceMethod);
		} else {
			this.serviceMethods = new ArrayList<>();
			this.serviceMethods.add(serviceMethod);
		}
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
}
