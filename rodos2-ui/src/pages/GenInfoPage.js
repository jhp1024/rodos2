import React, { useState, useEffect } from 'react';
import '../styles/GenInfoPage.css';
import { CATEGORY_OPTIONS, getCategoryInfo } from '../utils/Category';
import { generateModuleID } from '../utils/moduleID';

function GenInfoPage({ genInfo, onChange, onModuleIdChange }) {
    console.log('GenInfoPage rendered with genInfo:', genInfo);

    // genInfo가 null이면 빈 객체로 초기화
    const initGenInfo = genInfo || {};

    // 2단계 카테고리 드롭다운 상태만 local state
    const [selectedCategory1, setSelectedCategory1] = useState(initGenInfo.category1 || '');
    const [selectedCategory2, setSelectedCategory2] = useState(initGenInfo.category2 || '');

    useEffect(() => {
        setSelectedCategory1(initGenInfo.category1 || '');
        setSelectedCategory2(initGenInfo.category2 || '');
    }, [initGenInfo.category1, initGenInfo.category2]);

    // 필수 입력값 체크 함수 (Description, Examples 제외)
    const isRequiredFilled = () => {
        return (
            initGenInfo.moduleName &&
            initGenInfo.manufacturer &&
            initGenInfo.vendorPid1 && initGenInfo.vendorPid2 && initGenInfo.vendorPid3 &&
            initGenInfo.revisionNumber1 && initGenInfo.revisionNumber2 &&
            initGenInfo.serialNumber &&
            initGenInfo.instanceId &&
            selectedCategory1 && selectedCategory2
        );
    };

    // moduleID 생성
    const categoryInfo = getCategoryInfo(selectedCategory1, selectedCategory2);
    const moduleID = isRequiredFilled()
        ? generateModuleID(initGenInfo, categoryInfo, initGenInfo.instanceId)
        : null;

    // moduleID가 생성되면 부모(WizardDialog 등)에 전달
    useEffect(() => {
        if (moduleID && onModuleIdChange) {
            onModuleIdChange(moduleID);
        }
    }, [moduleID, onModuleIdChange]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (onChange) onChange({ ...(initGenInfo || {}), [name]: value });
    };
    const handleToggleChange = (name) => {
        if (onChange) onChange({ ...(initGenInfo || {}), [name]: !(initGenInfo?.[name] || false) });
    };
    const handleCompositeTypeChange = (type) => {
        const idType = type === 'basic' ? 'Bas' : 'Comp';
        if (onChange) onChange({
            ...(initGenInfo || {}),
            compositeType: type,
            idType: idType
        });
    };
    const handleCategory1Change = (e) => {
        setSelectedCategory1(e.target.value);
        setSelectedCategory2('');
        if (onChange) onChange({ ...initGenInfo, category1: e.target.value, category2: '' });
    };
    const handleCategory2Change = (e) => {
        setSelectedCategory2(e.target.value);
        if (onChange) onChange({ ...initGenInfo, category2: e.target.value });
    };
    const category2Options = CATEGORY_OPTIONS.find(opt => opt.value === selectedCategory1)?.children || [];

    // 16진수 2자리만 허용
    const handleHex2Input = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 2);
        e.target.value = value;
        handleInputChange(e);
    };
    // 16진수 4자리만 허용 (Revision Number Major/Minor)
    const handleHex4Input = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 4);
        e.target.value = value;
        handleInputChange(e);
    };
    // 10진수, 최대값 제한 (Serial Number)
    const handleSerialInput = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        if (Number(value) > 4294967295) value = '4294967295';
        e.target.value = value;
        handleInputChange(e);
    };
    // 0~255만 허용 (Instance ID)
    const handleInstanceIdInput = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (Number(value) > 255) value = '255';
        e.target.value = value;
        handleInputChange(e);
    };

    return (
        <form className="form" onSubmit={e => e.preventDefault()}>
            <div className="form-row">
                <div className="input-group full-width">
                    <label htmlFor="moduleName">Module Name</label>
                    <input
                        type="text"
                        id="moduleName"
                        name="moduleName"
                        placeholder="Enter module name"
                        value={initGenInfo.moduleName || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="input-group full-width">
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        placeholder="Enter manufactures"
                        value={initGenInfo.manufacturer || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="input-group half-width">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={initGenInfo.description || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group half-width">
                    <label htmlFor="examples">Examples</label>
                    <input
                        type="text"
                        id="examples"
                        name="examples"
                        value={initGenInfo.examples || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="input-group third-width">
                    <label>Vendor Specific PID (Hexa)</label>
                    <input type="text" name="vendorPid1" value={initGenInfo.vendorPid1 || ''} maxLength={2} onInput={handleHex2Input} />
                </div>
                <div className="input-group third-width">
                    <label style={{ visibility: 'hidden' }}>.</label>
                    <input type="text" name="vendorPid2" value={initGenInfo.vendorPid2 || ''} maxLength={2} onInput={handleHex2Input} />
                </div>
                <div className="input-group third-width">
                    <label style={{ visibility: 'hidden' }}>.</label>
                    <input type="text" name="vendorPid3" value={initGenInfo.vendorPid3 || ''} maxLength={2} onInput={handleHex2Input} />
                </div>
            </div>
            <div className="form-row">
                <div className="input-group half-width">
                    <label>Revision Number Major (Hexa, 4자리)</label>
                    <input type="text" name="revisionNumber1" value={initGenInfo.revisionNumber1 || ''} maxLength={4} onInput={handleHex4Input} />
                </div>
                <div className="input-group half-width">
                    <label>Revision Number Minor (Hexa, 4자리)</label>
                    <input type="text" name="revisionNumber2" value={initGenInfo.revisionNumber2 || ''} maxLength={4} onInput={handleHex4Input} />
                </div>
            </div>
            <div className="form-row">
                <div className="input-group half-width">
                    <label>Serial Number (Decimal)</label>
                    <input type="text" name="serialNumber" value={initGenInfo.serialNumber || ''} inputMode="numeric" onInput={handleSerialInput} />
                </div>
                <div className="input-group half-width">
                    <label>Instance ID (0~255)</label>
                    <input type="text" name="instanceId" value={initGenInfo.instanceId || ''} inputMode="numeric" onInput={handleInstanceIdInput} />
                </div>
            </div>
            <div className="form-row" style={{ alignItems: 'center' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Composite Type</label>
                    <div className="segmented-button">
                        <button
                            type="button"
                            className={initGenInfo.compositeType === 'basic' ? 'active' : ''}
                            onClick={() => handleCompositeTypeChange('basic')}
                        >
                            {initGenInfo.compositeType === 'basic' && <span className="check-icon">✓</span>}
                            Basic
                        </button>
                        <button
                            type="button"
                            className={initGenInfo.compositeType === 'composite' ? 'active' : ''}
                            onClick={() => handleCompositeTypeChange('composite')}
                        >
                            {initGenInfo.compositeType === 'composite' && <span className="check-icon">✓</span>}
                            Composite
                        </button>
                    </div>
                </div>
                <div className="input-group" style={{ flex: 1, marginLeft: 32 }}>
                    <label>Safety / Security</label>
                    <div className="toggle-switch-group">
                        <label className="toggle-switch">
                            <div className="switch">
                                <input type="checkbox" name="safety" checked={!!initGenInfo.safety} onChange={() => handleToggleChange('safety')} />
                                <span className="slider"></span>
                            </div>
                            <span>Safety</span>
                        </label>
                        <label className="toggle-switch">
                            <div className="switch">
                                <input type="checkbox" name="security" checked={!!initGenInfo.security} onChange={() => handleToggleChange('security')} />
                                <span className="slider"></span>
                            </div>
                            <span>Security</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="input-group half-width dropdown">
                    <label>Category (1st)</label>
                    <select value={selectedCategory1} onChange={handleCategory1Change}>
                        <option value="">Select First Level</option>
                        {CATEGORY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group half-width dropdown">
                    <label>Category (2nd)</label>
                    <select value={selectedCategory2} onChange={handleCategory2Change} disabled={!selectedCategory1}>
                        <option value="">Select Second Level</option>
                        {category2Options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ marginTop: 16, fontFamily: 'monospace', color: moduleID ? '#1976d2' : '#EB5757', background: '#f5f7fa', padding: 8, borderRadius: 4 }}>
                <strong>Module ID Preview:</strong>
                <div>
                    {moduleID ? moduleID : 'Error: 필수 입력값을 모두 입력하세요.'}
                </div>
            </div>
        </form>
    );
}

export default GenInfoPage;