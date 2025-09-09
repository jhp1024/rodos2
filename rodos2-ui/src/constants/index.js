// 애플리케이션 전체에서 사용되는 상수들

export const WIZARD_TYPES = {
    SIM: 'SIM',
    IMR: 'IMR',
    IMCON: 'IMCON'
};

export const MODULE_TYPES = {
    HW: 'hw',
    SW: 'sw'
};

export const CANVAS_CONSTANTS = {
    HEX_CENTER_X: 120,
    HEX_CENTER_Y: 120,
    MAX_HEX_DISTANCE: 80
};

export const API_ENDPOINTS = {
    WORKSPACE_STRUCTURE: '/app/api/workspace/structure',
    MODULE_UPDATE: '/app/api/module/update',
    MODULE_SAVE_XML: '/app/api/module/save-xml',
    MODULE_PREVIEW_XML: '/app/api/module/preview-xml',
    MODEL_SIM: '/app/api/model/sim',
    CANVAS_SAVE_STATE: '/app/api/canvas/save-state',
    CANVAS_LOAD_STATE: '/app/api/canvas/load-state',
    CANVAS_LAST_FILE: '/app/api/canvas/last-file',
    CANVAS_SAVE_CONFIG: '/app/api/canvas/save-config',
    CANVAS_OPEN_CONFIG: '/app/api/canvas/open-config',
    CANVAS_NEW_CONFIG: '/app/api/canvas/new-config',
    CANVAS_CONFIG_FILES: '/app/api/canvas/config-files',
    CANVAS_HW_MODULES: '/app/api/hw-modules',
    CANVAS_HW_MAPPING: '/app/api/save-hw-mapping',
    CANVAS_SIMULATION: '/app/api/simulation',
    CANVAS_OPERATIONS: '/app/api/operations',
    AGENT_DOCKER_AGENTS: '/app/api/agent/docker-agents',
    SHARED_USER_STATE: '/app/api/shared-user-state'
};

// Wizard 관련 상수들
export * from './wizard';

// SoftwareModule 관련 상수들
export * from './softwareModule'; 