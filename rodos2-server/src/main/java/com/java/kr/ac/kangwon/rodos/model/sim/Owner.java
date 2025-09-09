package com.java.kr.ac.kangwon.rodos.model.sim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.java.kr.ac.kangwon.rodos.model.cim.ModuleID;

public class Owner {

    @JacksonXmlProperty(localName = "ModuleID")
    private ModuleID moduleID;

    public ModuleID getModuleID() {
        return moduleID;
    }

    public void setModuleID(ModuleID moduleID) {
        this.moduleID = moduleID;
    }
}
