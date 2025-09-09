import { useState, useEffect, useMemo } from 'react';
import { CATEGORY_OPTIONS, getCategoryInfo } from '../utils/module/Category';
import { generateModuleID } from '../utils/module/ModuleID';

export function useGenInfoState(genInfo, onChange, onModuleIdChange) {
    // genInfo가 null이면 빈 객체로 초기화
    const initGenInfo = useMemo(() => genInfo || {}, [genInfo]);
    const [genInfoState, setGenInfoState] = useState(initGenInfo);

    // 2단계 카테고리 드롭다운 상태만 local state
    const [selectedCategory1, setSelectedCategory1] = useState(initGenInfo.category1 || '');
    const [selectedCategory2, setSelectedCategory2] = useState(initGenInfo.category2 || '');

    // 초기 로드 시에만 상태를 설정하고, 이후에는 로컬 상태를 유지
    useEffect(() => {
        // genInfoState가 비어있을 때만 초기화 (첫 로드 시)
        if (!genInfoState.moduleName && !genInfoState.manufacturer) {
            setGenInfoState(initGenInfo);
            setSelectedCategory1(initGenInfo.category1 || '');
            setSelectedCategory2(initGenInfo.category2 || '');
        }
    }, [initGenInfo, genInfoState.moduleName, genInfoState.manufacturer]);

    // 필수 입력값 체크 함수 (Description, Examples 제외)
    const isRequiredFilled = () => {
        return (
            genInfoState.moduleName &&
            genInfoState.manufacturer &&
            genInfoState.vendorPid1 && genInfoState.vendorPid2 && genInfoState.vendorPid3 &&
            genInfoState.revisionNumber1 && genInfoState.revisionNumber2 &&
            genInfoState.serialNumber &&
            genInfoState.instanceId &&
            genInfoState.idType &&
            selectedCategory1 && selectedCategory2
        );
    };

    // moduleID 생성
    const categoryInfo = getCategoryInfo(selectedCategory1, selectedCategory2);
    const moduleID = isRequiredFilled()
        ? generateModuleID(genInfoState, categoryInfo, genInfoState.instanceId)
        : null;

    // moduleID가 생성되면 부모(WizardDialog 등)에 전달
    useEffect(() => {
        if (moduleID && onModuleIdChange) {
            onModuleIdChange(moduleID);
        }
    }, [moduleID, onModuleIdChange]);

    // moduleID 문자열 생성 (UI 표시용)
    const moduleIDString = moduleID ? `${moduleID.mID}-${moduleID.iID}` : null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...genInfoState, [name]: value };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    const handleToggleChange = (name) => {
        const updated = { ...genInfoState, [name]: !(genInfoState?.[name] || false) };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    const handleCompositeTypeChange = (type) => {
        const idType = type === 'basic' ? 'Bas' : 'Comp';
        const updated = {
            ...genInfoState,
            idType: idType
        };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    const handleCategory1Change = (e) => {
        setSelectedCategory1(e.target.value);
        setSelectedCategory2('');
        const updated = { ...genInfoState, category1: e.target.value, category2: '' };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    const handleCategory2Change = (e) => {
        setSelectedCategory2(e.target.value);
        const updated = { ...genInfoState, category2: e.target.value };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    const category2Options = CATEGORY_OPTIONS.find(opt => opt.value === selectedCategory1)?.children || [];

    // 16진수 2자리만 허용
    const handleHex2Input = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 2);
        const updated = { ...genInfoState, [e.target.name]: value };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    // 16진수 4자리만 허용 (Revision Number Major/Minor)
    const handleHex4Input = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 4);
        const updated = { ...genInfoState, [e.target.name]: value };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    // 10진수, 최대값 제한 (Serial Number)
    const handleSerialInput = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        if (Number(value) > 4294967295) value = '4294967295';
        const updated = { ...genInfoState, [e.target.name]: value };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    // 0~255만 허용 (Instance ID)
    const handleInstanceIdInput = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (Number(value) > 255) value = '255';
        const updated = { ...genInfoState, [e.target.name]: value };
        setGenInfoState(updated);
        if (onChange) onChange(updated);
    };

    return {
        initGenInfo: genInfoState,
        selectedCategory1,
        selectedCategory2,
        moduleID,
        moduleIDString,
        category2Options,
        isRequiredFilled,
        handleInputChange,
        handleToggleChange,
        handleCompositeTypeChange,
        handleCategory1Change,
        handleCategory2Change,
        handleHex2Input,
        handleHex4Input,
        handleSerialInput,
        handleInstanceIdInput
    };
}
