package com.java.kr.ac.kangwon.rodos.model.cim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class CyberSecurity {

    @JacksonXmlProperty(localName = "OverallCybSecurityLevel")
    private String overallCybSecurityLevel;

    public String getOverallCybSecurityLevel() {
        return overallCybSecurityLevel;
    }

    public void setOverallCybSecurityLevel(String overallCybSecurityLevel) {
        this.overallCybSecurityLevel = overallCybSecurityLevel;
    }
}
