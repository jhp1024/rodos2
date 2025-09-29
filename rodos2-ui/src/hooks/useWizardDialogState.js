import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_SOFTWARE_MODULE_STATE, STEP_COMPLETION_CRITERIA } from '../constants/softwareModule';
import { wizardXMLService } from '../services/wizardService';

// 스키마에서 초기 상태 생성 함수
const initStateFromSchema = (schema) => {
    if (!schema) return DEFAULT_SOFTWARE_MODULE_STATE;

    // 기본 상태만 초기화 (중복 방지)
    return {
        type: 'SIM',
        isSafety: false,
        isSecurity: false,
        isHw: false,
        isSw: true,
        isTool: false,
        complexList: ['None', 'array', 'class', 'pointer', 'vector'],

        // 직접 속성들 (genInfo 제거)
        moduleName: '',
        manufacturer: '',
        description: '',
        examples: '',

        // 하위 객체들
        idnType: {
            informationModelVersion: '1.0',
            idtype: '',
            moduleID: { mID: '', iID: '' }
        },
        properties: {},
        ioVariables: {},
        services: {},
        infrastructure: {},
        safeSecure: {},
        modelling: {
            List_simulationModel: []
        },
        executableForm: {}
    };
};

export function useWizardDialogState(open, type, wizardData, onClose, onComplete, onWorkspaceRefresh) {
    const [moduleState, setModuleState] = useState(null);

    // moduleState 변경 시 로그
    useEffect(() => {
        if (moduleState) {
            console.log('moduleState updated:', moduleState);
        }
    }, [moduleState]);
    const [activeStep, setActiveStep] = useState(0);
    const [moduleID, setModuleID] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);

    // 스키마 로드 및 초기 상태 설정
    useEffect(() => {
        if (open && (type === 'SIM' || type === 'sim')) {
            fetch('/api/model/sim')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const initialState = initStateFromSchema(data);
                    setModuleState(initialState);
                })
                .catch(error => {
                    console.error('Error loading schema:', error);
                    setModuleState(DEFAULT_SOFTWARE_MODULE_STATE);
                });
        } else if (open && type === 'composite') {
            // Composite 타입의 경우 사전 설정된 상태로 초기화
            console.log('Composite Wizard 초기화', wizardData);

            // SharedUserState에서 모든 HW 모듈과 SW 모듈 정보 추출
            const sharedUserState = wizardData?.sharedUserState;
            const allHwModules = sharedUserState?.allHwModules || [];
            const modules = sharedUserState?.modules || [];

            // 현재 선택된 HW 모듈 찾기 (우클릭한 모듈)
            const selectedHwModule = wizardData?.hwModule;
            const selectedHwRef = selectedHwModule?.ref;

            console.log('Selected HW Module:', selectedHwModule);
            console.log('Selected HW Ref:', selectedHwRef);

            // 선택된 HW 모듈을 HWAspects로 설정
            const hwAspects = [];
            if (selectedHwModule && selectedHwRef) {
                // SharedUserState에서 해당 ref를 가진 HW 모듈 찾기
                const matchingHwModule = allHwModules.find(hw => hw.$.ref === selectedHwRef);
                if (matchingHwModule) {
                    hwAspects.push({
                        name: matchingHwModule.$.name,
                        moduleType: matchingHwModule.moduleType || matchingHwModule.$.type,
                        ref: matchingHwModule.$.ref,
                        classifier: matchingHwModule.$.classifier
                    });
                } else {
                    // Canvas에서 전달된 정보 사용
                    hwAspects.push({
                        name: selectedHwModule.name,
                        moduleType: selectedHwModule.moduleType,
                        ref: selectedHwModule.ref,
                        classifier: selectedHwModule.classifier
                    });
                }
            }

            // 선택된 HW 모듈에 연결된 SW 모듈들 찾기
            const swAspects = [];
            if (selectedHwModule && selectedHwRef) {
                // SharedUserState에서 해당 HW 모듈에 속한 SW 모듈들 찾기
                const connectedModules = modules.filter(module => {
                    // Module이 특정 Robot에 속하는지 확인
                    return module.$ && module.$.ref &&
                        (module.$.ref.includes(selectedHwRef) ||
                            selectedHwRef.includes(module.$.ref));
                });

                swAspects.push(...connectedModules.map(module => ({
                    name: module.$.name,
                    moduleType: module.$.type || 'software',
                    ref: module.$.ref
                })));

                // Canvas에서 전달된 연결된 SW 모듈들도 추가
                if (wizardData?.connectedSWModules) {
                    wizardData.connectedSWModules.forEach(swModule => {
                        if (!swAspects.find(existing => existing.ref === swModule.ref)) {
                            swAspects.push({
                                name: swModule.name,
                                moduleType: swModule.moduleType || 'software',
                                ref: swModule.ref
                            });
                        }
                    });
                }
            }

            const compositeState = {
                ...DEFAULT_SOFTWARE_MODULE_STATE,
                type: 'composite',
                idType: 'Comp', // Composite 타입으로 설정
                idnType: {
                    ...DEFAULT_SOFTWARE_MODULE_STATE.idnType,
                    idtype: 'Comp'
                },
                // SharedUserState에서 추출한 정보를 설정
                swAspects: swAspects,
                hwAspects: hwAspects,
                // 연결된 SW Module들도 추가 (Canvas에서 드래그된 것들)
                connectedSWModules: wizardData?.connectedSWModules || []
            };
            setModuleState(compositeState);
        } else if (open && type === 'controller') {
            // Controller 타입의 경우 기본 상태로 초기화
            console.log('Controller Wizard 초기화');
            setModuleState(DEFAULT_SOFTWARE_MODULE_STATE);
        }
    }, [open, type, wizardData]);

    // Dialog 닫힐 때 상태 초기화
    useEffect(() => {
        if (!open) {
            setModuleState(null);
            setCompletedSteps([]);
            setActiveStep(0);
            setModuleID(null);
        }
    }, [open]);

    // Module ID 변경 핸들러
    const handleModuleIdChange = useCallback((moduleID) => {
        setModuleID(moduleID);
        setModuleState(prev => {
            // moduleID가 객체인지 문자열인지 확인
            let mID = '';
            let iID = '';

            if (moduleID) {
                if (typeof moduleID === 'object' && moduleID.mID && moduleID.iID) {
                    // 객체인 경우
                    mID = moduleID.mID;
                    iID = moduleID.iID.toString(16).padStart(2, '0');
                } else if (typeof moduleID === 'string') {
                    // 문자열인 경우
                    mID = moduleID.slice(0, -2);
                    iID = moduleID.slice(-2);
                }
            }

            return {
                ...prev,
                idnType: {
                    ...(prev?.idnType || {}),
                    moduleID: { mID, iID }
                }
            };
        });
    }, []);

    // 단계별 데이터 변경 핸들러
    const handleStepChange = useCallback((stepKey, newData) => {
        console.log(`handleStepChange called - stepKey: ${stepKey}, newData:`, newData);

        setModuleState(prev => {
            let next = { ...(prev || {}) };

            // type 필드 명시적으로 유지
            if (prev && prev.type) {
                next.type = prev.type;
            }

            // 각 스텝별로 독립적인 데이터만 저장
            switch (stepKey) {
                case 'general':
                    // General Information 페이지의 모든 필드 저장
                    next.moduleName = newData.moduleName || '';
                    next.manufacturer = newData.manufacturer || '';
                    next.description = newData.description || '';
                    next.examples = newData.examples || '';
                    next.idType = newData.idType || '';
                    next.vendorPid1 = newData.vendorPid1 || '';
                    next.vendorPid2 = newData.vendorPid2 || '';
                    next.vendorPid3 = newData.vendorPid3 || '';
                    next.revisionNumber1 = newData.revisionNumber1 || '';
                    next.revisionNumber2 = newData.revisionNumber2 || '';
                    next.serialNumber = newData.serialNumber || '';
                    next.instanceId = newData.instanceId || '';
                    next.category1 = newData.category1 || '';
                    next.category2 = newData.category2 || '';
                    // safety, security 동기화
                    if (newData.safety !== undefined) next.isSafety = newData.safety;
                    if (newData.security !== undefined) next.isSecurity = newData.security;
                    break;

                case 'idnType':
                    // idnType 관련 데이터만 저장
                    next.idnType = {
                        informationModelVersion: newData.informationModelVersion || '1.0',
                        idtype: newData.idtype || '',
                        moduleID: newData.moduleID || { mID: '', iID: '' },
                        swAspects: newData.swAspects || []
                    };
                    break;

                case 'properties':
                    // properties 관련 데이터만 저장
                    next.properties = {
                        properties: newData.properties || [],
                        osType: newData.osType || {},
                        compilerType: newData.compilerType || {},
                        executionTypes: newData.executionTypes || [],
                        libraries: newData.libraries || [],
                        organization: newData.organization || {}
                    };
                    break;

                case 'ioVariables':
                    // ioVariables 관련 데이터만 저장
                    next.ioVariables = {
                        inputs: newData.inputs || [],
                        outputs: newData.outputs || [],
                        inouts: newData.inouts || []
                    };
                    break;

                case 'services':
                    // services 관련 데이터만 저장
                    next.services = {
                        noOfBasicService: newData.noOfBasicService || 0,
                        noOfOptionalService: newData.noOfOptionalService || 0,
                        serviceProfiles: newData.serviceProfiles || []
                    };
                    break;

                case 'infrastructure':
                    // infrastructure 관련 데이터만 저장
                    next.infrastructure = {
                        databases: newData.databases || [],
                        middlewares: newData.middlewares || [],
                        communications: newData.communications || []
                    };
                    break;

                case 'safeSecure':
                    // safeSecure 관련 데이터만 저장
                    next.safeSecure = {
                        safetyLevel: newData.safetyLevel || '',
                        securityLevel: newData.securityLevel || ''
                    };
                    break;

                case 'executableForm':
                    // executableForm 관련 데이터만 저장
                    next.executableForm = {
                        exeForms: newData.exeForms || []
                    };
                    break;

                default:
                    // 기본 처리
                    next[stepKey] = newData;
                    break;
            }

            console.log('handleStepChange - updated moduleState:', next);
            console.log('handleStepChange - specific step data:', next[stepKey]);
            return next;
        });
    }, []);

    // 다음 단계로 이동
    const handleNext = useCallback(() => {
        console.log('Current moduleState on Next:', moduleState);

        // 현재 단계의 모든 입력 정보를 저장
        if (activeStep === 1) { // IDnType 페이지
            const currentIdnType = moduleState?.idnType || {};
            const updatedIdnType = {
                ...currentIdnType,
                informationModelVersion: currentIdnType.informationModelVersion || '1.0'
            };
            setModuleState(prev => ({
                ...prev,
                idnType: updatedIdnType
            }));
        }

        setCompletedSteps(prev => Array.from(new Set([...prev, activeStep])));
        setActiveStep(prev => prev + 1);
    }, [activeStep, moduleState]);

    // 이전 단계로 이동
    const handlePrevious = useCallback(() => {
        setActiveStep(prev => prev - 1);
    }, []);

    // 특정 단계로 이동
    const handleStepClick = useCallback((stepIndex) => {
        setActiveStep(stepIndex);
    }, []);

    // 백엔드에 모듈 업데이트
    const updateModuleToBackend = useCallback(async () => {
        if (!moduleState) return;

        const moduleData = {
            type: moduleState.type || 'SIM',
            isSafety: moduleState.isSafety || false,
            isSecurity: moduleState.isSecurity || false,
            isHw: moduleState.isHw || false,
            isSw: moduleState.isSw || true,
            isTool: moduleState.isTool || false,
            complexList: moduleState.complexList || ['None', 'array', 'class', 'pointer', 'vector'],
            genInfo: moduleState.genInfo || {},
            idnType: moduleState.idnType || {},
            properties: moduleState.properties || {},
            ioVariables: moduleState.ioVariables || {},
            services: moduleState.services || {},
            infrastructure: moduleState.infrastructure || {},
            safeSecure: moduleState.safeSecure || {},
            modelling: moduleState.modelling || {},
            executableForm: moduleState.executableForm || {}
        };

        const response = await fetch('/api/module/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(moduleData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update module: ${response.status}`);
        }
    }, [moduleState]);

    // XML 파일로 저장
    const saveModuleToXML = useCallback(async () => {
        if (!moduleState) return;

        console.log('saveModuleToXML - moduleState:', moduleState);
        console.log('saveModuleToXML - moduleState.type:', moduleState.type);
        console.log('saveModuleToXML - moduleState.properties:', moduleState.properties);

        // 모듈 타입에 따라 데이터 구성
        let moduleData;

        if (moduleState.type === 'composite') {
            // Composite 모듈인 경우 CompModule 구조에 맞게 데이터 구성
            moduleData = {
                type: 'Composite',
                isSafety: moduleState.isSafety || false,
                isSecurity: moduleState.isSecurity || false,
                isHw: moduleState.isHw || true,
                isSw: moduleState.isSw || true,
                isTool: moduleState.isTool || false,
                complexList: moduleState.complexList || ['None', 'array', 'class', 'pointer', 'vector'],
                moduleName: moduleState.moduleName || '',
                manufacturer: moduleState.manufacturer || '',
                description: moduleState.description || '',
                examples: moduleState.examples || '',
                idnType: moduleState.idnType || {},
                properties: moduleState.properties || {},
                ioVariables: moduleState.ioVariables || {},
                services: moduleState.services || {},
                infrastructure: moduleState.infrastructure || {},
                safeSecure: moduleState.safeSecure || {},
                modelling: moduleState.modelling || {},
                executableForm: moduleState.executableForm || {},
                // 선택된 로봇 정보 추가
                selectedRobotName: wizardData?.hwModule?.name || null
            };
        } else {
            // Software 모듈인 경우 SoftwareModule 구조에 맞게 데이터 구성
            console.log('Processing as SoftwareModule');
            moduleData = {
                type: 'SIM',
                isSafety: moduleState.isSafety || false,
                isSecurity: moduleState.isSecurity || false,
                isHw: moduleState.isHw || false,
                isSw: moduleState.isSw || true,
                isTool: moduleState.isTool || false,
                complexList: moduleState.complexList || ['None', 'array', 'class', 'pointer', 'vector'],
                moduleName: moduleState.moduleName || '',
                manufacturer: moduleState.manufacturer || '',
                description: moduleState.description || '',
                examples: moduleState.examples || '',
                idnType: moduleState.idnType || {},
                properties: moduleState.properties || {},
                ioVariables: moduleState.ioVariables || {},
                services: moduleState.services || {},
                infrastructure: moduleState.infrastructure || {},
                safeSecure: moduleState.safeSecure || {},
                modelling: moduleState.modelling || {},
                executableForm: moduleState.executableForm || {}
            };
        }

        console.log('saveModuleToXML - moduleData:', moduleData);

        // Workspace 갱신 콜백을 포함하여 XML 저장
        await wizardXMLService.saveXML(moduleData, null, () => {
            console.log('XML saved successfully, refreshing workspace...');
            if (onWorkspaceRefresh && typeof onWorkspaceRefresh === 'function') {
                onWorkspaceRefresh();
            }
        });
    }, [moduleState, onWorkspaceRefresh]);

    // 단계 완료 여부 확인
    const isStepCompleted = useCallback((stepIdx) => {
        const criteria = STEP_COMPLETION_CRITERIA[stepIdx];
        if (!criteria) return false;
        return criteria(moduleState, moduleID);
    }, [moduleState, moduleID]);

    // 단계 체크 여부 확인
    const isStepChecked = useCallback((stepIdx) => {
        if (stepIdx === 0) return isStepCompleted(0);
        return completedSteps.includes(stepIdx);
    }, [completedSteps, isStepCompleted]);

    // 완료 처리
    const handleComplete = useCallback(async () => {
        try {
            await updateModuleToBackend();
            await saveModuleToXML();
            alert('Module saved successfully!');

            if (onComplete) {
                onComplete();
            }
            onClose();
        } catch (error) {
            console.error('Error saving module:', error);
            alert('Failed to save module. Please try again.');
        }
    }, [onComplete, onClose, updateModuleToBackend, saveModuleToXML]);

    // moduleID 문자열 생성 (UI 표시용)
    const moduleIDString = moduleID ? `${moduleID.mID}-${moduleID.iID}` : null;

    return {
        moduleState,
        activeStep,
        moduleID,
        moduleIDString,
        completedSteps,
        handleModuleIdChange,
        handleStepChange,
        handleNext,
        handlePrevious,
        handleStepClick,
        handleComplete,
        isStepCompleted,
        isStepChecked
    };
} 