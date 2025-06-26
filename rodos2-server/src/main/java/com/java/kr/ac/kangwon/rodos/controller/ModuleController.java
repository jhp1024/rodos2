package com.java.kr.ac.kangwon.rodos.controller;

import com.java.kr.ac.kangwon.rodos.model.sim.SoftwareModule;
import com.java.kr.ac.kangwon.rodos.service.SoftwareModuleService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.module.jsonSchema.JsonSchema;
import com.fasterxml.jackson.module.jsonSchema.JsonSchemaGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ModuleController {

    @Autowired
    private SoftwareModuleService softwareModuleService;

    @GetMapping("/api/model/sim")
    public JsonSchema getModuleSchema() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonSchemaGenerator schemaGen = new JsonSchemaGenerator(mapper);
        return schemaGen.generateSchema(SoftwareModule.class);
    }

    @PostMapping("/api/module/update")
    public ResponseEntity<String> updateModule(@RequestBody String moduleData) {
        try {
            System.out.println("Received module data: " + moduleData);

            ObjectMapper mapper = new ObjectMapper();

            // JSON 파싱 설정 개선
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT,
                    true);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL,
                    true);

            SoftwareModule softwareModule = mapper.readValue(moduleData, SoftwareModule.class);

            System.out.println("genInfo: " + softwareModule.getGenInfo());
            System.out.println("idnType: " + softwareModule.getIdnType());
            System.out.println("properties: " + softwareModule.getProperties());
            System.out.println("ioVariables: " + softwareModule.getIoVariables());
            System.out.println("infrastructure: " + softwareModule.getInfrastructure());
            System.out.println("executableForm: " + softwareModule.getExecutableForm());

            softwareModuleService.updateModule(softwareModule);
            System.out.println("Module updated successfully in service");
            return ResponseEntity.ok("Module updated successfully");
        } catch (JsonProcessingException e) {
            System.out.println("JSON Processing Error: " + e.getMessage());
            System.out.println("Error location: " + e.getLocation());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid JSON format: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("ERROR in updateModule: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating module: " + e.getMessage());
        }
    }

    @PostMapping("/api/module/preview-xml")
    public ResponseEntity<String> previewModuleXML(@RequestBody String moduleData) {
        try {
            System.out.println("=== Preview XML Request ===");
            System.out.println("Received module data: " + moduleData);

            ObjectMapper mapper = new ObjectMapper();
            // JSON 파싱 설정 개선
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT,
                    true);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL,
                    true);

            System.out.println("Parsing JSON to SoftwareModule...");
            SoftwareModule softwareModule = mapper.readValue(moduleData, SoftwareModule.class);
            System.out.println("SoftwareModule parsed successfully");
            System.out.println("genInfo: " + softwareModule.getGenInfo());
            System.out.println("idnType: " + softwareModule.getIdnType());
            System.out.println("properties: " + softwareModule.getProperties());
            System.out.println("ioVariables: " + softwareModule.getIoVariables());
            System.out.println("infrastructure: " + softwareModule.getInfrastructure());
            System.out.println("executableForm: " + softwareModule.getExecutableForm());

            // XML 변환 - 들여쓰기와 줄바꿈 적용
            System.out.println("Converting to XML...");
            com.fasterxml.jackson.dataformat.xml.XmlMapper xmlMapper = new com.fasterxml.jackson.dataformat.xml.XmlMapper();
            xmlMapper.enable(com.fasterxml.jackson.core.JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN);
            // XML 포맷팅 설정
            xmlMapper.enable(com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT);
            String xml = xmlMapper.writeValueAsString(softwareModule);
            System.out.println("XML generated successfully");
            System.out.println("XML preview: " + xml.substring(0, Math.min(xml.length(), 200)) + "...");

            return ResponseEntity.ok(xml);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            System.out.println("JSON Processing Error in preview-xml: " + e.getMessage());
            System.out.println("Error location: " + e.getLocation());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid JSON format: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("ERROR in previewModuleXML: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error generating XML preview: " + e.getMessage());
        }
    }

    @PostMapping("/api/module/save-xml")
    public ResponseEntity<String> saveModuleXML(@RequestBody String moduleData) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            // JSON 파싱 설정 개선
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT,
                    true);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL,
                    true);

            SoftwareModule softwareModule = mapper.readValue(moduleData, SoftwareModule.class);

            // XML 변환 - 들여쓰기와 줄바꿈 적용
            com.fasterxml.jackson.dataformat.xml.XmlMapper xmlMapper = new com.fasterxml.jackson.dataformat.xml.XmlMapper();
            xmlMapper.enable(com.fasterxml.jackson.core.JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN);
            // XML 포맷팅 설정
            xmlMapper.enable(com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT);
            String xml = xmlMapper.writeValueAsString(softwareModule);

            // Module Info 디렉토리 생성
            String moduleInfoDir = ".rodos/WorkSpace/Module Info";
            Path moduleInfoPath = Paths.get(moduleInfoDir);
            if (!Files.exists(moduleInfoPath)) {
                Files.createDirectories(moduleInfoPath);
            }

            // 파일명 생성 (GenInfo.ModuleName.xml)
            String moduleName = (softwareModule.getGenInfo() != null
                    && softwareModule.getGenInfo().getModuleName() != null)
                            ? softwareModule.getGenInfo().getModuleName()
                            : "software_module";
            if (moduleName.trim().isEmpty()) {
                moduleName = "software_module";
            }
            String fileName = moduleName + ".xml";
            Path filePath = moduleInfoPath.resolve(fileName);

            // XML 파일 저장
            try (FileWriter writer = new FileWriter(filePath.toFile())) {
                writer.write(xml);
            }

            System.out.println("XML file saved successfully: " + filePath.toAbsolutePath());
            return ResponseEntity.ok("XML file saved successfully: " + filePath.toAbsolutePath());
        } catch (Exception e) {
            System.out.println("ERROR in saveModuleXML: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving XML file: " + e.getMessage());
        }
    }

    @GetMapping("/api/workspace/structure")
    public ResponseEntity<List<Map<String, Object>>> getWorkspaceStructure() {
        try {
            List<Map<String, Object>> structure = new ArrayList<>();

            // .rodos/WorkSpace 디렉토리 경로
            Path workspacePath = Paths.get(".rodos", "WorkSpace");

            if (!Files.exists(workspacePath)) {
                // 디렉토리가 없으면 기본 구조 생성
                Files.createDirectories(workspacePath);
                Files.createDirectories(workspacePath.resolve("Configuration"));
                Files.createDirectories(workspacePath.resolve("Module Info"));
            }

            // WorkSpace 루트 노드
            Map<String, Object> workspaceNode = new HashMap<>();
            workspaceNode.put("key", "workspace");
            workspaceNode.put("label", "WorkSpace");

            List<Map<String, Object>> workspaceChildren = new ArrayList<>();

            // Configuration 디렉토리
            Path configPath = workspacePath.resolve("Configuration");
            Map<String, Object> configNode = new HashMap<>();
            configNode.put("key", "configuration");
            configNode.put("label", "Configuration");

            List<Map<String, Object>> configChildren = new ArrayList<>();
            if (Files.exists(configPath)) {
                try (Stream<Path> paths = Files.list(configPath)) {
                    paths.filter(Files::isRegularFile)
                            .forEach(file -> {
                                Map<String, Object> fileNode = new HashMap<>();
                                fileNode.put("key", "config_" + file.getFileName().toString());
                                fileNode.put("label", file.getFileName().toString());
                                fileNode.put("path", file.toString());
                                configChildren.add(fileNode);
                            });
                }
            }
            configNode.put("children", configChildren);
            workspaceChildren.add(configNode);

            // Module Info 디렉토리
            Path moduleInfoPath = workspacePath.resolve("Module Info");
            Map<String, Object> moduleInfoNode = new HashMap<>();
            moduleInfoNode.put("key", "moduleinfo");
            moduleInfoNode.put("label", "Module Info");

            List<Map<String, Object>> moduleInfoChildren = new ArrayList<>();
            if (Files.exists(moduleInfoPath)) {
                try (Stream<Path> paths = Files.list(moduleInfoPath)) {
                    paths.filter(Files::isRegularFile)
                            .forEach(file -> {
                                Map<String, Object> fileNode = new HashMap<>();
                                fileNode.put("key", "module_" + file.getFileName().toString());
                                fileNode.put("label", file.getFileName().toString());
                                fileNode.put("path", file.toString());
                                moduleInfoChildren.add(fileNode);
                            });
                }
            }
            moduleInfoNode.put("children", moduleInfoChildren);
            workspaceChildren.add(moduleInfoNode);

            workspaceNode.put("children", workspaceChildren);
            structure.add(workspaceNode);

            return ResponseEntity.ok(structure);
        } catch (Exception e) {
            System.out.println("ERROR in getWorkspaceStructure: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}