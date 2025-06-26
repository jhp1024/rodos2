package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.List;

public class Values {

	private List<String> item;

	public void addItem(String item) {
		if (this.item != null)
			this.item.add(item);
		else {
			this.item = new ArrayList<>();
			this.item.add(item);
		}
	}

	public void setItem(List<String> item) {
		this.item = item;
	}

	public List<String> getItem() {
		return item;
	}
}
