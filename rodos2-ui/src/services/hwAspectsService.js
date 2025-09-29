// HWAspects 관련 API 서비스
export const hwAspectsService = {
    // Registry에서 HW 모듈 목록 조회 (robot, edge, cloud classification)
    async getHWModules() {
        try {
            const response = await fetch('/api/registry/all');
            if (response.ok) {
                const data = await response.json();
                const hwModules = [];

                // Edge 모듈들
                if (data.edge && Array.isArray(data.edge)) {
                    hwModules.push(...data.edge.map(module => ({
                        ...module,
                        moduleType: 'edge',
                        type: 'edge'
                    })));
                }

                // Cloud 모듈들
                if (data.cloud && Array.isArray(data.cloud)) {
                    hwModules.push(...data.cloud.map(module => ({
                        ...module,
                        moduleType: 'cloud',
                        type: 'cloud'
                    })));
                }

                // Controller 모듈들 (Robot HW)
                if (data.controller && Array.isArray(data.controller)) {
                    hwModules.push(...data.controller.map(module => ({
                        ...module,
                        moduleType: 'robot',
                        type: 'robot'
                    })));
                }

                return hwModules;
            }
            throw new Error('Failed to fetch HW modules');
        } catch (error) {
            console.error('Error fetching HW modules:', error);
            return [];
        }
    },

    // 선택된 HW 모듈들을 ModuleID 형태로 변환
    transformToModuleIDs(selectedModules) {
        return selectedModules.map(module => {
            const moduleID = module.moduleID || '';
            // moduleID에서 mID와 iID 추출 (예: "0001-00000001-00000001-00000001-000001")
            const parts = moduleID.split('-');
            const mID = parts.length >= 5 ? parts.slice(0, 4).join('-') : moduleID;
            const iID = parts.length >= 5 ? parts[4] : '00';

            return {
                mID: mID,
                iID: iID
            };
        });
    }
};
