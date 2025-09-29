import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import '../../styles/wizard/WizardDialog.css';
import { useWizardDialogState } from '../../hooks/useWizardDialogState';

// 단계별 페이지 import
import GenInfoPage from './GenInfoPage';
import IDnTypePage from './IDnTypePage';
import PropertiesPage from './PropertiesPage';
import IOVariablesPage from './IOVariablesPage';
import ServicesPage from './ServicesPage';
import InfrastructurePage from './InfrastructurePage';
import SafeSecurePage from './SafeSecurePage';
import ExecutableFormPage from './ExecutableFormPage';
import ModellingPage from './ModellingPage';
import CheckPage from './CheckPage';

// 타입별 스텝 정의
const getStepsByType = (type) => {
    switch (type) {
        case 'controller':
            return [
                'General Information',
                'IDnType',
                'Check'
            ];
        case 'software':
            return [
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
        case 'composite':
            return [
                'General Information',
                'IDnType',
                'Properties',
                'IOVariables',
                'Services',
                'InfraStructure',
                'SafeSecure',
                'Modelling',
                'ExecutableForm',
                'Check',
            ];
        default:
            return [
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
    }
};

function WizardDialog({ open, type, wizardData, onClose, onComplete, onWorkspaceRefresh }) {
    const {
        moduleState,
        activeStep,
        moduleID,
        moduleIDString,
        handleModuleIdChange,
        handleStepChange,
        handleNext,
        handlePrevious,
        handleStepClick,
        handleComplete,
        isStepCompleted,
        isStepChecked
    } = useWizardDialogState(open, type, wizardData, onClose, onComplete, onWorkspaceRefresh);

    // 타입에 따른 스텝 가져오기
    const steps = getStepsByType(type);

    // 각 스텝별 페이지 렌더링
    const renderStepContent = (step) => {
        if (!moduleState) return <div>Loading...</div>;

        // Controller 타입의 경우 간단한 스텝 처리
        if (type === 'controller') {
            switch (step) {
                case 0:
                    return <GenInfoPage
                        genInfo={moduleState}
                        onChange={data => handleStepChange('general', data)}
                        onModuleIdChange={handleModuleIdChange}
                    />;
                case 1:
                    return <IDnTypePage
                        idnType={moduleState.idnType}
                        genInfo={{
                            moduleName: moduleState.moduleName || '',
                            manufacturer: moduleState.manufacturer || '',
                            idType: moduleState.idType || ''
                        }}
                        moduleID={moduleID}
                        moduleIDString={moduleIDString}
                        onChange={data => handleStepChange('idnType', data)}
                    />;
                case 2:
                    return <CheckPage
                        moduleName={moduleState?.moduleName}
                        manufacturer={moduleState?.manufacturer}
                        description={moduleState?.description}
                        examples={moduleState?.examples}
                        idnType={moduleState?.idnType}
                        properties={moduleState?.properties}
                        ioVariables={moduleState?.ioVariables}
                        services={moduleState?.services}
                        infrastructure={moduleState?.infrastructure}
                        safeSecure={moduleState?.safeSecure}
                        modelling={moduleState?.modelling}
                        executableForm={moduleState?.executableForm}
                    />;
                default:
                    return <div />;
            }
        }

        // Composite 타입의 경우 전체 스텝 처리
        if (type === 'composite') {
            switch (step) {
                case 0:
                    return <GenInfoPage
                        genInfo={moduleState}
                        onChange={data => handleStepChange('general', data)}
                        onModuleIdChange={handleModuleIdChange}
                    />;
                case 1:
                    return <IDnTypePage
                        idnType={moduleState.idnType}
                        genInfo={{
                            moduleName: moduleState.moduleName || '',
                            manufacturer: moduleState.manufacturer || '',
                            idType: moduleState.idType || ''
                        }}
                        moduleID={moduleID}
                        moduleIDString={moduleIDString}
                        swAspects={moduleState.swAspects}
                        hwAspects={moduleState.hwAspects}
                        onChange={data => handleStepChange('idnType', data)}
                    />;
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
                    return <ModellingPage
                        modelling={moduleState.modelling}
                        onChange={data => handleStepChange('modelling', data)}
                    />;
                case 8:
                    return <ExecutableFormPage moduleState={moduleState} setModuleState={(newState) => handleStepChange('executableForm', newState)} />;
                case 9:
                    return <CheckPage
                        moduleName={moduleState?.moduleName}
                        manufacturer={moduleState?.manufacturer}
                        description={moduleState?.description}
                        examples={moduleState?.examples}
                        idnType={moduleState?.idnType}
                        properties={moduleState?.properties}
                        ioVariables={moduleState?.ioVariables}
                        services={moduleState?.services}
                        infrastructure={moduleState?.infrastructure}
                        safeSecure={moduleState?.safeSecure}
                        modelling={moduleState?.modelling}
                        executableForm={moduleState?.executableForm}
                    />;
                default:
                    return <div />;
            }
        }

        // Software/SIM 타입의 경우 기존 전체 스텝 처리
        switch (step) {
            case 0:
                return <GenInfoPage
                    genInfo={moduleState}
                    onChange={data => handleStepChange('general', data)}
                    onModuleIdChange={handleModuleIdChange}
                />;
            case 1:
                return <IDnTypePage
                    idnType={moduleState.idnType}
                    genInfo={{
                        moduleName: moduleState.moduleName || '',
                        manufacturer: moduleState.manufacturer || '',
                        idType: moduleState.idType || ''
                    }}
                    moduleID={moduleID}
                    moduleIDString={moduleIDString}
                    onChange={data => handleStepChange('idnType', data)}
                />;
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
                return <ExecutableFormPage moduleState={moduleState} setModuleState={(newState) => handleStepChange('executableForm', newState)} />;
            case 8:
                return <CheckPage
                    moduleName={moduleState?.moduleName}
                    manufacturer={moduleState?.manufacturer}
                    description={moduleState?.description}
                    examples={moduleState?.examples}
                    idnType={moduleState?.idnType}
                    properties={moduleState?.properties}
                    ioVariables={moduleState?.ioVariables}
                    services={moduleState?.services}
                    infrastructure={moduleState?.infrastructure}
                    safeSecure={moduleState?.safeSecure}
                    modelling={moduleState?.modelling}
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
                                    onClick={() => handleStepClick(idx)}
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
                    <Button onClick={handlePrevious}>이전</Button>
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