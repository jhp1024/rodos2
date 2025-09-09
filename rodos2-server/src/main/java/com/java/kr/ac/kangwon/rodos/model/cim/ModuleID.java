package com.java.kr.ac.kangwon.rodos.model.cim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class ModuleID {
    @JacksonXmlProperty(localName = "mID")
    String mID;

    @JacksonXmlProperty(localName = "iID")
    String iID;

    public String getmID() {
        return mID;
    }

    public String getiID() {
        return iID;
    }

    public void setmID(String mID) {
        this.mID = mID;
    }

    public void setiID(String iID) {
        this.iID = iID;
    }
}
