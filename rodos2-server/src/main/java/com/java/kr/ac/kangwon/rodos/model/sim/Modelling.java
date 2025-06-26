package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

public class Modelling {

	public List<ModelCase> list_simulationModel;

	public void addSimModel(ModelCase modelCase) {
		if (this.list_simulationModel != null) {
			this.list_simulationModel.add(modelCase);
		} else {
			this.list_simulationModel = new ArrayList<>();
			this.list_simulationModel.add(modelCase);
		}
	}

	public List<ModelCase> getList_simulationModel() {
		return this.list_simulationModel;
	}
}
