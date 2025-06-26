package com.java.kr.ac.kangwon.rodos.model.sim;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Infrastructure {

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "Database")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<InfraType> databases;

	@JacksonXmlElementWrapper(useWrapping = false)
	@JacksonXmlProperty(localName = "Middleware")
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<InfraType> middlewares;

	@JacksonXmlProperty(localName = "Communications")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Communications communications;

	public Infrastructure() {
		this.databases = new ArrayList<>();
		this.middlewares = new ArrayList<>();
		this.communications = new Communications();
	}

	public List<InfraType> getDatabases() {
		return this.databases;
	}

	public void addDatabase(InfraType database) {
		if (this.databases != null) {
			this.databases.add(database);
		} else {
			this.databases = new ArrayList<>();
			this.databases.add(database);
		}
	}

	public Communications getCommunications() {
		return this.communications;
	}

	public void setCommunications(Communications communications) {
		this.communications = communications;
	}

	public List<InfraType> getMiddlewares() {
		return this.middlewares;
	}

	public void addMiddleware(InfraType middleware) {
		if (this.middlewares != null) {
			this.middlewares.add(middleware);
		} else {
			this.middlewares = new ArrayList<>();
			this.middlewares.add(middleware);
		}
	}
}
