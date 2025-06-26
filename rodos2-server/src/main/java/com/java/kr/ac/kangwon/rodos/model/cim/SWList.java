package com.java.kr.ac.kangwon.rodos.model.cim;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class SWList {

    private List<String> mSWList;

    public SWList() {
        mSWList = new LinkedList<>();
    }

    public List<String> getSWList() {
        return mSWList;
    }

    public void addModuleIDToSWList(String moduleId) {
        if (this.mSWList != null)
            this.mSWList.add(moduleId);
        else {
            this.mSWList = new ArrayList<>();
            this.mSWList.add(moduleId);
        }
    }
}
