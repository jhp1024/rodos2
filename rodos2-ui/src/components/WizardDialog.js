import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// 단계별 페이지 import
import GenInfoPage from '../pages/GenInfoPage';
import IDnTypePage from '../pages/IDnTypePage';

const steps = ['GenInfo', 'IDnType', 'Check'];

function WizardDialog({ open, onClose }) {
    const [activeStep, setActiveStep] = useState(0);
    const [genInfo, setGenInfo] = useState({
        ModuleName: '',
        Manufactures: '',
        Description: '',
        Examples: ''
    });
    const [idnType, setIdnType] = useState({
        type: '',
        ID: '',
        informationModelVersion: ''
    });

    const handleFinish = () => {
        // XML 문자열 생성
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Module>\n  <GenInfo>\n    <ModuleName>${genInfo.ModuleName}</ModuleName>\n    <Manufactures>${genInfo.Manufactures}</Manufactures>\n    <Description>${genInfo.Description}</Description>\n    <Examples>${genInfo.Examples}</Examples>\n  </GenInfo>\n  <IDnType type="${idnType.type}">\n    <ID>${idnType.ID}</ID>\n    <informationModelVersion>${idnType.informationModelVersion}</informationModelVersion>\n  </IDnType>\n</Module>`;
        // 파일 저장
        const blob = new Blob([xml], { type: 'application/xml' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${genInfo.ModuleName || 'module'}.xml`;
        a.click();
        onClose();
    };

    // 단계별 페이지 렌더링
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <GenInfoPage genInfo={genInfo} onChange={setGenInfo} />;
            case 1:
                return <IDnTypePage idnType={idnType} onChange={setIdnType} />;
            case 2:
                return (
                    <div>
                        <h4>입력 정보 확인</h4>
                        <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 14 }}>
                            {`<Module>
  <GenInfo>
    <ModuleName>${genInfo.ModuleName}</ModuleName>
    <Manufactures>${genInfo.Manufactures}</Manufactures>
    <Description>${genInfo.Description}</Description>
    <Examples>${genInfo.Examples}</Examples>
  </GenInfo>
  <IDnType type="${idnType.type}">
    <ID>${idnType.ID}</ID>
    <informationModelVersion>${idnType.informationModelVersion}</informationModelVersion>
  </IDnType>
</Module>`}
                        </pre>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Information Model Editor</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div style={{ marginTop: 24 }}>
                    {renderStepContent(activeStep)}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {activeStep > 0 && <Button onClick={() => setActiveStep((prev) => prev - 1)}>이전</Button>}
                {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={() => setActiveStep((prev) => prev + 1)}>다음</Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleFinish}>Finish</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default WizardDialog;