import React, { useState } from 'react';
import TopTabs from '../components/TopTabs';
import FileMenuBar from '../components/FileMenuBar';
import WizardDialog from '../components/WizardDialog';
import Sidebar from '../components/Sidebar';
import MenuBar from '../components/MenuBar';
import Canvas from '../components/Canvas';
import '../styles/IDE.css';

function IDE() {
  const [selectedTab, setSelectedTab] = useState('File');
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <div className="ide-container">
      <TopTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
      {selectedTab === 'File' && (
        <FileMenuBar onNewSIM={() => setWizardOpen(true)} />
      )}
      <MenuBar />
      <div className="main-content">
        <Sidebar />
        <Canvas />
      </div>
      <WizardDialog open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}

export default IDE;