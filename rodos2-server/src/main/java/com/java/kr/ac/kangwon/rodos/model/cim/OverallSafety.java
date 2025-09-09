package com.java.kr.ac.kangwon.rodos.model.cim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class OverallSafety {

    @JacksonXmlProperty(localName = "OverallSafetyType")
    private String overallSafetyType;

    public String getOverallSafetyType() {
        return overallSafetyType;
    }

    public void setOverallSafetyType(String overallSafetyType) {
        this.overallSafetyType = overallSafetyType;
    }
}
