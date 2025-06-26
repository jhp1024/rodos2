import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from 'react';
import './WizardDialog.css';

// 단계별 페이지 import
import GenInfoPage from '../pages/GenInfoPage';
import IDnTypePage from '../pages/IDnTypePage';
import PropertiesPage from '../pages/PropertiesPage';
import IOVariablesPage from '../pages/IOVariablesPage';
import ServicesPage from '../pages/ServicesPage';
import InfrastructurePage from '../pages/InfrastructurePage';
import SafeSecurePage from '../pages/SafeSecurePage';
import ExecutableFormPage from '../pages/ExecutableFormPage';
import CheckPage from '../pages/CheckPage';

const steps = [
    'General Information',
    'IDnType',
    'Properties',
    'IOVariables',
    'Services',
    'InfraStructure',
    'SafeSecure',
    'ExecutableForm',
    'Check',
];

// Move this function outside the component to avoid useEffect dependency warning
const initStateFromSchema = (schema) => {
    if (!schema) return undefined;
    if (schema.type === 'object' && schema.properties) {
        const state = {};
        for (const key in schema.properties) {
            // parent 필드는 null로 설정 (빈 문자열 대신)
            if (key === 'parent') {
                state[key] = null;
            } else {
                state[key] = initStateFromSchema(schema.properties[key]);
            }
        }
        return state;
    }
    if (schema.type === 'array') {
        return [];
    }
    if (schema.type === 'boolean') {
        return false;
    }
    if (schema.type === 'number' || schema.type === 'integer') {
        return 0;
    }
    // string 등
    return '';
};

function WizardDialog({ open, type, onClose, onComplete }) {
    const [moduleState, setModuleState] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [moduleID, setModuleID] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);

    useEffect(() => {
        if (open && (type === 'SIM' || type === 'sim')) {
            fetch('/app/api/model/sim')
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
                    // 에러 시 기본 상태로 초기화
                    setModuleState({
                        genInfo: {},
                        idnType: {},
                        properties: {},
                        ioVariables: {},
                        services: {},
                        infrastructure: {},
                        safeSecure: {},
                        executableForm: {}
                    });
                });
        }
    }, [open, type]);

    useEffect(() => {
        if (!open) {
            setModuleState(null);
            setCompletedSteps([]);
        }
    }, [open]);

    // GenInfoPage에서 moduleID 생성 시 mID/iID로 분리하여 idnType에 저장
    const handleModuleIdChange = (moduleID) => {
        setModuleID(moduleID);
        setModuleState(prev => {
            const mID = moduleID ? moduleID.slice(0, -2) : '';
            const iID = moduleID ? moduleID.slice(-2) : '';
            return {
                ...prev,
                moduleID,
                idnType: {
                    ...(prev?.idnType || {}),
                    moduleID: { mID, iID }
                }
            };
        });
    };

    // 각 페이지의 onChange가 호출될 때 moduleState 갱신
    const handleStepChange = (stepKey, newData) => {
        setModuleState(prev => {
            let next = { ...(prev || {}), [stepKey]: { ...(prev?.[stepKey] || {}), ...newData } };
            // genInfo.idType이 바뀌면 idnType.IDtype도 동기화
            if (stepKey === 'genInfo' && newData.idType) {
                next.idnType = { ...(next.idnType || {}), IDtype: newData.idType };
            }
            // genInfo의 safety, security 값이 바뀌면 SoftwareModule의 isSafety, isSecurity도 동기화
            if (stepKey === 'genInfo') {
                if (newData.safety !== undefined) next.isSafety = newData.safety;
                if (newData.security !== undefined) next.isSecurity = newData.security;
            }
            return next;
        });
    };

    // 다음 버튼 클릭 시 백엔드에 moduleState 저장 제거
    const handleNext = () => {
        console.log('Current moduleState on Next:', moduleState);
        setCompletedSteps(prev => Array.from(new Set([...prev, activeStep])));
        setActiveStep(prev => prev + 1);
    };

    // 완료 버튼에서만 백엔드로 POST
    const handleComplete = async () => {
        try {
            // 1. 먼저 moduleState를 백엔드에 업데이트
            await updateModuleToBackend();

            // 2. XML 파일로 저장
            await saveModuleToXML();

            alert('Module saved successfully!');

            // 3. 워크스페이스 갱신 콜백 호출
            if (onComplete) {
                onComplete();
            }

            onClose();
        } catch (error) {
            console.error('Error saving module:', error);
            alert('Failed to save module. Please try again.');
        }
    };

    // moduleState를 백엔드에 POST
    const updateModuleToBackend = async () => {
        if (!moduleState) return;
        const softwareModuleData = {
            // SoftwareModule의 직접적인 필드들
            isSafety: moduleState.isSafety || false,
            isSecurity: moduleState.isSecurity || false,
            isSw: true,
            // 하위 객체들
            genInfo: moduleState.genInfo || {},
            idnType: moduleState.idnType || {},
            properties: moduleState.properties || {},
            ioVariables: moduleState.ioVariables || {},
            services: moduleState.services || {},
            infrastructure: moduleState.infrastructure || {},
            safeSecure: moduleState.safeSecure || {},
            executableForm: moduleState.executableForm || {}
        };
        const response = await fetch('/app/api/module/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(softwareModuleData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update module: ${response.status}`);
        }
    };

    // moduleState를 XML 파일로 저장
    const saveModuleToXML = async () => {
        if (!moduleState) return;
        const softwareModuleData = {
            // SoftwareModule의 직접적인 필드들
            isSafety: moduleState.isSafety || false,
            isSecurity: moduleState.isSecurity || false,
            isSw: true,
            // 하위 객체들
            genInfo: moduleState.genInfo || {},
            idnType: moduleState.idnType || {},
            properties: moduleState.properties || {},
            ioVariables: moduleState.ioVariables || {},
            services: moduleState.services || {},
            infrastructure: moduleState.infrastructure || {},
            safeSecure: moduleState.safeSecure || {},
            executableForm: moduleState.executableForm || {}
        };
        const response = await fetch('/app/api/module/save-xml', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(softwareModuleData)
        });

        if (!response.ok) {
            throw new Error(`Failed to save XML: ${response.status}`);
        }

        const result = await response.text();
        console.log('XML saved:', result);
    };

    // 스텝 완료 체크 (실제 입력값 기준)
    const isStepCompleted = (stepIdx) => {
        if (stepIdx === 0) {
            const g = moduleState?.genInfo;
            return !!(g && g.moduleName && g.manufacturer && g.vendorPid1 && g.vendorPid2 && g.vendorPid3 && g.revisionNumber1 && g.revisionNumber2 && g.serialNumber && g.instanceId && g.category1 && g.category2);
        }
        if (stepIdx === 1) {
            const idn = moduleState?.idnType;
            const g = moduleState?.genInfo;
            return !!(idn && idn.infoModelVersion && idn.IDtype && moduleID && g.manufacturer);
        }
        if (stepIdx === 2) {
            const p = moduleState?.properties;
            return !!(p && ((p.osType && p.osType.type) || (p.compilerType && p.compilerType.osName) || (p.compilerType && p.compilerType.compilerName)));
        }
        if (stepIdx === 3) {
            const io = moduleState?.ioVariables;
            return !!(io && (io.Inputs?.length > 0 || io.Outputs?.length > 0 || io.InOuts?.length > 0));
        }
        if (stepIdx === 4) {
            const s = moduleState?.services;
            return !!(s && (s.serviceProfiles?.length > 0 || s.noOfBasicService || s.noOfOptionalService));
        }
        if (stepIdx === 5) {
            const infra = moduleState?.infrastructure;
            return !!(infra && (infra.databases?.length > 0 || infra.middlewares?.length > 0 || (infra.communications?.communicationList?.length > 0)));
        }
        if (stepIdx === 6) {
            // SafeSecure 완료 조건: 활성화된 Safety 또는 Security의 기본 레벨 설정
            const safeSecure = moduleState?.safeSecure;
            const isSafety = moduleState?.isSafety;
            const isSecurity = moduleState?.isSecurity;

            if (!isSafety && !isSecurity) {
                return true; // 둘 다 비활성화되어 있으면 완료로 인정
            }

            if (isSafety) {
                // Safety가 활성화된 경우 PL/SIL Type이 설정되어 있으면 완료
                const hasSafetyLevel = safeSecure?.overallValidSafetyLevelType &&
                    safeSecure.overallValidSafetyLevelType !== '';
                if (!hasSafetyLevel) return false;
            }

            if (isSecurity) {
                // Security가 활성화된 경우 Physical Level 또는 Cyber Level이 설정되어 있으면 완료
                const hasSecurityLevel = (safeSecure?.overallPhySecurityLevel &&
                    safeSecure.overallPhySecurityLevel !== '') ||
                    (safeSecure?.overallCybSecurityLevel &&
                        safeSecure.overallCybSecurityLevel !== '');
                if (!hasSecurityLevel) return false;
            }

            return true;
        }
        if (stepIdx === 7) {
            const exec = moduleState?.executableForm;
            return !!(exec && (exec.executableType || exec.executableName || exec.executablePath));
        }
        return false;
    };

    // 체크표시(완료) 기준: 0번(GenInfoPage)은 기존 isStepCompleted(0), 나머지는 completedSteps에 포함되어 있으면 체크
    const isStepChecked = (stepIdx) => {
        if (stepIdx === 0) return isStepCompleted(0);
        return completedSteps.includes(stepIdx);
    };

    // 각 스텝별 페이지 렌더링
    const renderStepContent = (step) => {
        if (!moduleState) return <div>Loading...</div>;
        switch (step) {
            case 0:
                return <GenInfoPage genInfo={moduleState.genInfo} onChange={data => handleStepChange('genInfo', data)} onModuleIdChange={handleModuleIdChange} />;
            case 1:
                return <IDnTypePage idnType={moduleState.idnType} genInfo={moduleState.genInfo} moduleID={moduleID} onChange={data => handleStepChange('idnType', data)} />;
            case 2:
                return <PropertiesPage properties={moduleState.properties} onChange={data => handleStepChange('properties', data)} />;
            case 3:
                return <IOVariablesPage ioVariables={moduleState.ioVariables} setIoVariables={data => handleStepChange('ioVariables', data)} />;
            case 4:
                return <ServicesPage services={moduleState.services} onChange={data => handleStepChange('services', data)} />;
            case 5:
                return <InfrastructurePage infrastructure={moduleState.infrastructure} setInfrastructure={data => handleStepChange('infrastructure', data)} />;
            case 6:
                return <SafeSecurePage
                    safeSecure={moduleState.safeSecure}
                    onChange={data => handleStepChange('safeSecure', data)}
                    isSafety={moduleState.isSafety || false}
                    isSecurity={moduleState.isSecurity || false}
                />;
            case 7:
                return <ExecutableFormPage moduleState={moduleState} setModuleState={setModuleState} />;
            case 8:
                return <CheckPage
                    genInfo={moduleState?.genInfo}
                    idnType={moduleState?.idnType}
                    properties={moduleState?.properties}
                    ioVariables={moduleState?.ioVariables}
                    services={moduleState?.services}
                    infrastructure={moduleState?.infrastructure}
                    safeSecure={moduleState?.safeSecure}
                    executableForm={moduleState?.executableForm}
                />;
            default:
                return <div />;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="wizard-title">Information Model Editor</DialogTitle>
            <DialogContent>
                <div className="wizard-dialog-container">
                    {/* 좌측 스텝퍼 */}
                    <div className="wizard-stepper">
                        {steps.map((label, idx) => {
                            const completed = isStepChecked(idx);
                            const isActive = activeStep === idx;
                            return (
                                <div
                                    key={label}
                                    className={`wizard-step${isActive ? ' active' : ''}${completed ? ' completed' : ''}`}
                                    onClick={() => setActiveStep(idx)}
                                >
                                    <div className="wizard-step-number">
                                        {completed ? <span className="step-complete-icon">✓</span> : idx + 1}
                                    </div>
                                    <div className="wizard-step-label">{label}</div>
                                </div>
                            );
                        })}
                    </div>
                    {/* 우측 단계별 입력 폼 */}
                    <div className="wizard-content">{renderStepContent(activeStep)}</div>
                </div>
            </DialogContent>
            <div className="wizard-actions">
                <Button onClick={onClose}>취소</Button>
                {activeStep > 0 && activeStep < steps.length - 1 && (
                    <Button onClick={() => setActiveStep((prev) => prev - 1)}>이전</Button>
                )}
                {activeStep === 0 && (
                    <Button variant="contained" onClick={handleNext} disabled={!isStepCompleted(0)}>
                        다음
                    </Button>
                )}
                {activeStep === 1 && (
                    <Button variant="contained" onClick={handleNext}>
                        다음
                    </Button>
                )}
                {activeStep > 1 && activeStep < steps.length - 1 && (
                    <Button variant="contained" onClick={handleNext} disabled={(activeStep === 2 && !isStepCompleted(2))}>
                        다음
                    </Button>
                )}
                {activeStep === steps.length - 1 && (
                    <Button variant="contained" color="primary" onClick={handleComplete}>
                        완료
                    </Button>
                )}
            </div>
        </Dialog>
    );
}

export default WizardDialog;