import React, { useState, useRef } from 'react';
import IDEMenuBar from '../components/IDEMenuBar';
import WizardDialog from '../components/WizardDialog';
import Sidebar from '../components/Sidebar';
import MenuBar from '../components/MenuBar';
import Canvas from '../components/Canvas';
import '../styles/IDE.css';

function IDE() {
  const [wizardType, setWizardType] = useState('sim');
  const [wizardOpen, setWizardOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleNewSIM = () => {
    console.log('New SIM button clicked');
    setWizardType('SIM');
    setWizardOpen(true);
    console.log('Wizard state updated:', { type: 'SIM', open: true });
  };

  const handleWizardComplete = () => {
    // Wizard 완료 후 Sidebar의 workspace 구조를 갱신
    if (sidebarRef.current && sidebarRef.current.refreshWorkspace) {
      sidebarRef.current.refreshWorkspace();
    }
  };

  console.log('IDE rendered with wizard state:', { wizardOpen, wizardType });

  return (
    <div className="ide-container">
      <IDEMenuBar onNewSIM={handleNewSIM} />
      <MenuBar />
      <div className="main-content">
        <Sidebar ref={sidebarRef} />
        <Canvas />
      </div>
      <WizardDialog
        open={wizardOpen}
        type={wizardType}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}

export default IDE;