package com.java.kr.ac.kangwon.rodos.model.cim;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Safety {

    @JacksonXmlProperty(localName = "overall")
    private OverallSafety overall;

    public OverallSafety getOverall() {
        return overall;
    }

    public void setOverall(OverallSafety overall) {
        this.overall = overall;
    }
}
