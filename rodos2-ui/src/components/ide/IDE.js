import React, { useRef, useEffect } from 'react';
import IDEMenuBar from './IDEMenuBar';
import WizardDialog from '../wizard/WizardDialog';
import Sidebar from './Sidebar';
import MenuBox from './MenuBox';
import Canvas from './Canvas';
import { useIDEState } from '../../hooks/useIDEState';
import { useRefreshRecovery, useNetworkStatus } from '../../hooks/useRefreshRecovery';
import { sharedUserStateAPI } from '../../services/api';
import '../../styles/ide/IDE.css';

function IDE() {
  const sidebarRef = useRef(null);
  const canvasRef = useRef(null);
  const { wizardType, wizardOpen, wizardData, openWizard, closeWizard } = useIDEState();

  // 새로고침 복구 및 네트워크 상태 감지
  const { isRefreshing } = useRefreshRecovery();
  const isOnline = useNetworkStatus();

  // 새로고침 후 복구 로직
  useEffect(() => {
    if (isRefreshing) {
      console.log('IDE: Page refreshed, initializing recovery...');
      // 새로고침 후 필요한 초기화 작업 수행
    }
  }, [isRefreshing]);

  // 네트워크 상태 변화 감지
  useEffect(() => {
    if (!isOnline) {
      console.warn('IDE: Network is offline');
    } else {
      console.log('IDE: Network is back online');
    }
  }, [isOnline]);

  const handleNewSIM = () => {
    console.log('New SIM button clicked');
    openWizard('SIM');
    console.log('Wizard state updated:', { type: 'SIM', open: true });
  };

  const handleNewController = () => {
    console.log('New Controller button clicked');
    openWizard('controller');
    console.log('Wizard state updated:', { type: 'controller', open: true });
  };

  const handleOpenCompositeWizard = async (hwModuleIdx, hwModule) => {
    console.log('Composite Wizard 열기:', hwModuleIdx, hwModule);

    try {
      // SharedUserState에서 현재 Robot과 Module 정보를 읽어옴
      const sharedUserState = await sharedUserStateAPI.getCurrentState();
      console.log('SharedUserState loaded:', sharedUserState);

      // 모든 HW 모듈과 SW 모듈 정보 추출
      const editors = sharedUserState?.editors?.System || {};

      // 모든 HW 모듈들 (Robot, Edge, Cloud 등) 추출
      const allHwModules = [];

      // Robot 모듈들
      if (editors.Robot) {
        const robots = Array.isArray(editors.Robot) ? editors.Robot : [editors.Robot];
        allHwModules.push(...robots.map(robot => ({
          ...robot,
          moduleType: robot.$.type || 'robot'
        })));
      }

      // Edge 모듈들
      if (editors.Edge) {
        const edges = Array.isArray(editors.Edge) ? editors.Edge : [editors.Edge];
        allHwModules.push(...edges.map(edge => ({
          ...edge,
          moduleType: edge.$.type || 'edge'
        })));
      }

      // Cloud 모듈들
      if (editors.Cloud) {
        const clouds = Array.isArray(editors.Cloud) ? editors.Cloud : [editors.Cloud];
        allHwModules.push(...clouds.map(cloud => ({
          ...cloud,
          moduleType: cloud.$.type || 'cloud'
        })));
      }

      // SW 모듈들
      const modules = editors.Module ?
        (Array.isArray(editors.Module) ? editors.Module : [editors.Module]) : [];

      // 현재 HW Module과 연결된 SW Module들을 수집
      const connectedSWModules = hwModule?.swModules || [];

      // SharedUserState에서 모든 HW 모듈과 SW 모듈 정보를 추가로 전달
      const compositeData = {
        hwModuleIdx,
        hwModule,
        connectedSWModules,
        sharedUserState: {
          allHwModules,
          modules
        }
      };

      // Composite Wizard 열기 (데이터와 함께)
      openWizard('composite', compositeData);
    } catch (error) {
      console.error('Failed to load SharedUserState:', error);
      // SharedUserState 로드 실패 시 기본 데이터로 진행
      openWizard('composite', {
        hwModuleIdx,
        hwModule,
        connectedSWModules: hwModule?.swModules || []
      });
    }
  };

  const handleWizardComplete = (wizardData) => {
    // Wizard 완료 후 Sidebar의 workspace 구조를 갱신
    if (sidebarRef.current && sidebarRef.current.refreshWorkspace) {
      sidebarRef.current.refreshWorkspace();
    }

    // Composite Wizard가 완료된 경우 HW Module을 Composite으로 업데이트
    if (wizardData && wizardData.type === 'composite' && wizardData.hwModuleIdx !== undefined) {
      // Canvas의 updateHWModuleToComposite 함수 호출
      if (canvasRef.current && canvasRef.current.updateHWModuleToComposite) {
        canvasRef.current.updateHWModuleToComposite(wizardData.hwModuleIdx, wizardData);
      }
      console.log('Composite Wizard 완료:', wizardData);
    }
  };

  console.log('IDE rendered with wizard state:', { wizardOpen, wizardType });

  return (
    <div className="ide-container">
      <IDEMenuBar onNewSIM={handleNewSIM} onNewController={handleNewController} />
      <MenuBox />
      <div className="main-content">
        <Sidebar ref={sidebarRef} />
        <Canvas ref={canvasRef} onOpenCompositeWizard={handleOpenCompositeWizard} />
      </div>
      <WizardDialog
        open={wizardOpen}
        type={wizardType}
        wizardData={wizardData}
        onClose={closeWizard}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}

export default IDE;