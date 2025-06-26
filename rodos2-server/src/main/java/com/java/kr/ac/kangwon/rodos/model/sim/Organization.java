package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.java.kr.ac.kangwon.rodos.model.Enumerate;
import com.java.kr.ac.kangwon.rodos.model.cim.NameValue;

public class Organization {

	private String owner;

	private Enumerate.DependencyType dependency;

	private OrgMemberType orgMemberType;

	private List<NameValue> additionalInfo;

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public Enumerate.DependencyType getDependency() {
		return dependency;
	}

	public void setDependency(Enumerate.DependencyType dependency) {
		this.dependency = dependency;
	}

	public OrgMemberType getOrgMemberType() {
		return orgMemberType;
	}

	public void setOrgMemberType(OrgMemberType orgMemberType) {
		this.orgMemberType = orgMemberType;
	}

	public void addAdditionalInfo(NameValue namevalue) {
		if (this.additionalInfo == null)
			this.additionalInfo = new ArrayList<>();
		this.additionalInfo.add(namevalue);
	}

	public List<NameValue> getAdditionalInfo() {
		return this.additionalInfo;
	}
}