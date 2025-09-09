package com.java.kr.ac.kangwon.rodos.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.java.kr.ac.kangwon.rodos.model.sim.SoftwareModule;
import com.java.kr.ac.kangwon.rodos.service.ModuleClassifier;
import com.java.kr.ac.kangwon.rodos.service.rest.informationModel.IM;
import com.java.kr.ac.kangwon.rodos.service.rest.informationModel.IMRegistryApi;

/**
 * IM Registry REST API Controller
 * Edge, Robot 등의 정보 모델을 Registry에서 관리하고 Workspace 기능도 통합
 */
@RestController
@RequestMapping("/api/registry")
@CrossOrigin(origins = "*")
public class IMRegistryController {

    @Autowired
    private IMRegistryApi registryService;

    @Autowired
    private ModuleClassifier moduleClassifier;

    /**
     * 모든 모듈을 가져와서 자동으로 분류하여 반환
     */
    @GetMapping("/all")
    public ResponseEntity<Object> getAllModules() {
        try {
            System.out.println("=== getAllModules 호출 시작 ===");

            // 각 분류별로 직접 호출하여 모듈 목록 조회
            List<IM> aiModules = registryService.getListIM("ai");
            System.out.println("AI 모듈 개수: " + aiModules.size());

            List<IM> robotModules = registryService.getListIM("robot");
            System.out.println("Robot 모듈 개수: " + robotModules.size());

            List<IM> controllerModules = registryService.getListIM("controller");
            System.out.println("Controller 모듈 개수: " + controllerModules.size());

            List<IM> edgeModules = registryService.getListIM("edge");
            System.out.println("Edge 모듈 개수: " + edgeModules.size());

            List<IM> cloudModules = registryService.getListIM("cloud");
            System.out.println("Cloud 모듈 개수: " + cloudModules.size());

            // 분류된 결과를 맵으로 반환
            var result = new java.util.HashMap<String, Object>();
            result.put("ai", aiModules);
            result.put("robot", robotModules);
            result.put("controller", controllerModules);
            result.put("edge", edgeModules);
            result.put("cloud", cloudModules);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("=== getAllModules 예외 발생 ===");
            System.out.println("예외 타입: " + e.getClass().getSimpleName());
            System.out.println("예외 메시지: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 특정 분류의 모듈 목록 조회
     */
    @GetMapping("/list/{classification}")
    public ResponseEntity<List<IM>> getListIM(@PathVariable String classification) {
        try {
            List<IM> modules = registryService.getListIM(classification);
            return ResponseEntity.ok(modules);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * AI 모듈 목록 조회
     */
    @GetMapping("/ai")
    public ResponseEntity<List<IM>> getAiModules() {
        try {
            List<IM> aiModules = registryService.getListIM("ai");
            return ResponseEntity.ok(aiModules);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Software 모듈 목록 조회
     */
    @GetMapping("/software")
    public ResponseEntity<List<IM>> getSoftwareModules() {
        try {
            List<IM> softwareModules = registryService.getListIM("software");
            return ResponseEntity.ok(softwareModules);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Controller 모듈 목록 조회
     */
    @GetMapping("/controller")
    public ResponseEntity<List<IM>> getControllerModules() {
        try {
            List<IM> controllerModules = registryService.getListIM("controller");
            return ResponseEntity.ok(controllerModules);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 모듈 ID로 모듈 정보 조회
     */
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<IM> getIM(@PathVariable String moduleId) {
        try {
            IM module = registryService.getIM(moduleId);
            if (module != null) {
                return ResponseEntity.ok(module);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 새 모듈 등록 (JSON 또는 파일 업로드 지원)
     */
    @PostMapping("/module/upload")
    public ResponseEntity<String> doUploadIM(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestBody(required = false) IM informationModel) {
        try {
            IM im;

            if (file != null) {
                // 파일 업로드 처리
                String moduleName = file.getOriginalFilename();
                if (moduleName != null && moduleName.contains(".")) {
                    moduleName = moduleName.substring(0, moduleName.lastIndexOf("."));
                }

                String xmlContent = new String(file.getBytes());
                SoftwareModule softwareModule = moduleClassifier.xmlToSoftwareModuleSafe(xmlContent, moduleName);

                im = new IM(
                        softwareModule.getModuleName(),
                        softwareModule.getModuleName(),
                        xmlContent,
                        IM.Type.SOFTWARE);
            } else if (informationModel != null) {
                // JSON 요청 처리
                im = informationModel;
            } else {
                return ResponseEntity.badRequest().body("Either file or JSON data is required");
            }

            // 모듈 ID를 분석하여 자동으로 분류 설정
            String detectedClassification = moduleClassifier.classifyModule(im.getModuleID());
            im.setClassification(detectedClassification);

            boolean success = registryService.doUploadIM(im);
            if (success) {
                String message = file != null
                        ? "Module file uploaded and registered successfully: " + file.getOriginalFilename()
                        : "Module added successfully";
                return ResponseEntity.ok(message + " with classification: " + detectedClassification);
            } else {
                return ResponseEntity.internalServerError().body("Failed to add module");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error adding module: " + e.getMessage());
        }
    }

    /**
     * 모듈 삭제 (모듈 ID 또는 파일명으로)
     */
    @DeleteMapping("/module/delete")
    public ResponseEntity<String> deleteIM(
            @RequestParam(value = "moduleId", required = false) String moduleId,
            @RequestBody(required = false) Map<String, String> request) {
        try {
            String targetId = moduleId;

            if (targetId == null && request != null) {
                // 파일명으로 삭제
                String filename = request.get("filename");
                if (filename == null) {
                    return ResponseEntity.badRequest()
                            .body("Either moduleId parameter or filename in body is required");
                }

                // 파일명에서 모듈명 추출 (확장자 제거)
                targetId = filename;
                if (targetId.contains(".")) {
                    targetId = targetId.substring(0, targetId.lastIndexOf("."));
                }
            } else if (targetId == null) {
                return ResponseEntity.badRequest().body("Either moduleId parameter or filename in body is required");
            }

            boolean success = registryService.deleteIM(targetId);
            if (success) {
                return ResponseEntity.ok("Module deleted successfully: " + targetId);
            } else {
                return ResponseEntity.internalServerError().body("Failed to delete module");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting module: " + e.getMessage());
        }
    }

    // ========== Workspace 기능 ==========

    /**
     * Workspace 구조 조회
     */
    @GetMapping("/workspace/structure")
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
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
