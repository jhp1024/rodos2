// SWAspects 관련 API 서비스
export const swAspectsService = {
    // Registry에서 SW 모듈 목록 조회 (robot classification)
    async getSWModules() {
        try {
            const response = await fetch('/api/registry/all');
            if (response.ok) {
                const data = await response.json();
                return data.robot || [];
            }
            throw new Error('Failed to fetch SW modules');
        } catch (error) {
            console.error('Error fetching SW modules:', error);
            return [];
        }
    },

    // 선택된 SW 모듈들을 ModuleID 형태로 변환
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
