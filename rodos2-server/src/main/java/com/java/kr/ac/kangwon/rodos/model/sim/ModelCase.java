package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.java.kr.ac.kangwon.rodos.model.cim.NameValue;

public class ModelCase {

	public String simulator;

	public List<ModelFile> modelFiles;

	public List<DynamicSW> dynamicSWs;

	public List<NameValue> additionalInfo;

	public String getSimulator() {
		return simulator;
	}

	public void setSimulator(String simulator) {
		this.simulator = simulator;
	}

	public List<ModelFile> getModelFiles() {
		return this.modelFiles;
	}

	public void addModelFile(ModelFile modelFile) {
		if (this.modelFiles != null) {
			this.modelFiles.add(modelFile);
		} else {
			this.modelFiles = new ArrayList<>();
			this.modelFiles.add(modelFile);
		}
	}

	public List<DynamicSW> getDynamicSWs() {
		return this.dynamicSWs;
	}

	public void addModelFile(DynamicSW dynamicSW) {
		if (this.dynamicSWs != null) {
			this.dynamicSWs.add(dynamicSW);
		} else {
			this.dynamicSWs = new ArrayList<>();
			this.dynamicSWs.add(dynamicSW);
		}
	}
}
