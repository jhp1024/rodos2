import { useEffect, useMemo, useCallback, useState } from 'react';
import { swAspectsService } from '../services/swAspectsService';
import { hwAspectsService } from '../services/hwAspectsService';

export function useIDnTypeState(idnType, onChange, genInfo, moduleID, moduleIDString) {
    const initIdnType = useMemo(() => idnType || {}, [idnType]);
    const initGenInfo = useMemo(() => genInfo || {}, [genInfo]);

    // SWAspects 관련 상태
    const [swModules, setSwModules] = useState([]);
    const [selectedSWModules, setSelectedSWModules] = useState([]);
    const [loading, setLoading] = useState(false);

    // HWAspects 관련 상태
    const [hwModules, setHwModules] = useState([]);
    const [selectedHWModules, setSelectedHWModules] = useState([]);
    const [hwLoading, setHwLoading] = useState(false);

    // genInfo.idType이 변경될 때 idnType.idtype도 자동으로 업데이트
    useEffect(() => {
        if (initGenInfo.idType && initGenInfo.idType !== initIdnType.idtype) {
            if (onChange) {
                onChange({
                    ...(initIdnType || {}),
                    idtype: initGenInfo.idType
                });
            }
        }
    }, [initGenInfo.idType, initIdnType, onChange]);

    // SW 모듈 목록 로드
    const loadSWModules = useCallback(async () => {
        if (initGenInfo.idType === 'Comp') {
            setLoading(true);
            try {
                const modules = await swAspectsService.getSWModules();
                setSwModules(modules);
            } catch (error) {
                console.error('Error loading SW modules:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [initGenInfo.idType]);

    // HW 모듈 목록 로드
    const loadHWModules = useCallback(async () => {
        if (initGenInfo.idType === 'Comp') {
            setHwLoading(true);
            try {
                const modules = await hwAspectsService.getHWModules();
                setHwModules(modules);
            } catch (error) {
                console.error('Error loading HW modules:', error);
            } finally {
                setHwLoading(false);
            }
        }
    }, [initGenInfo.idType]);

    // idType이 Comp일 때 SW 모듈 로드
    useEffect(() => {
        loadSWModules();
    }, [loadSWModules]);

    // idType이 Comp일 때 HW 모듈 로드
    useEffect(() => {
        loadHWModules();
    }, [loadHWModules]);

    // SW 모듈 선택/해제 핸들러
    const handleSWModuleToggle = useCallback((module) => {
        setSelectedSWModules(prev => {
            const isSelected = prev.some(m => m.moduleID === module.moduleID);
            if (isSelected) {
                return prev.filter(m => m.moduleID !== module.moduleID);
            } else {
                return [...prev, module];
            }
        });
    }, []);

    // HW 모듈 선택/해제 핸들러
    const handleHWModuleToggle = useCallback((module) => {
        setSelectedHWModules(prev => {
            const isSelected = prev.some(m => m.moduleID === module.moduleID);
            if (isSelected) {
                return prev.filter(m => m.moduleID !== module.moduleID);
            } else {
                return [...prev, module];
            }
        });
    }, []);

    // 선택된 SW 모듈들을 SWAspects로 변환하여 저장
    const updateSWAspects = useCallback(() => {
        if (onChange) {
            const moduleIDs = swAspectsService.transformToModuleIDs(selectedSWModules);
            onChange({
                ...(initIdnType || {}),
                swAspects: moduleIDs
            });
        }
    }, [selectedSWModules, initIdnType, onChange]);

    // 선택된 HW 모듈들을 HWAspects로 변환하여 저장
    const updateHWAspects = useCallback(() => {
        if (onChange) {
            const moduleIDs = hwAspectsService.transformToModuleIDs(selectedHWModules);
            onChange({
                ...(initIdnType || {}),
                hwAspects: moduleIDs
            });
        }
    }, [selectedHWModules, initIdnType, onChange]);

    // 선택된 SW 모듈이 변경될 때마다 SWAspects 업데이트
    useEffect(() => {
        if (initGenInfo.idType === 'Comp') {
            updateSWAspects();
        }
    }, [selectedSWModules, updateSWAspects, initGenInfo.idType]);

    // 선택된 HW 모듈이 변경될 때마다 HWAspects 업데이트
    useEffect(() => {
        if (initGenInfo.idType === 'Comp') {
            updateHWAspects();
        }
    }, [selectedHWModules, updateHWAspects, initGenInfo.idType]);

    // 이벤트 핸들러
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        console.log(`IDnTypePage - handleInputChange: ${name} = ${value}`);
        if (onChange) {
            const newData = { ...(initIdnType || {}), [name]: value, moduleID, moduleIDString };
            console.log(`IDnTypePage - calling onChange with:`, newData);
            onChange(newData);
        }
    }, [initIdnType, onChange, moduleID, moduleIDString]);

    return {
        initIdnType,
        initGenInfo,
        handleInputChange,
        swModules,
        selectedSWModules,
        loading,
        handleSWModuleToggle,
        hwModules,
        selectedHWModules,
        hwLoading,
        handleHWModuleToggle
    };
} 