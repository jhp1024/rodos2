import React from 'react';
import '../../styles/wizard/IDnTypePage.css';
import { useIDnTypeState } from '../../hooks/useIDnTypeState';

function IDnTypePage({ idnType, onChange, genInfo, moduleID, moduleIDString, swAspects, hwAspects }) {
    const {
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
    } = useIDnTypeState(idnType, onChange, genInfo, moduleID, moduleIDString);

    return (
        <div className="idntype-page">
            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="moduleName">Module Name</label>
                        <input
                            id="moduleName"
                            type="text"
                            value={initGenInfo.moduleName || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="idType">ID Type</label>
                        <input
                            id="idType"
                            type="text"
                            value={initGenInfo.idType || initIdnType.idtype || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="moduleId">Module ID</label>
                        <input
                            id="moduleId"
                            type="text"
                            value={moduleIDString || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="manufacturer">Manufacturer</label>
                        <input
                            id="manufacturer"
                            type="text"
                            value={initGenInfo.manufacturer || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="infoModelVersion">InfoModelVersion</label>
                        <input
                            id="infoModelVersion"
                            name="informationModelVersion"
                            type="text"
                            value={initIdnType.informationModelVersion || '1.0'}
                            onChange={handleInputChange}
                            placeholder="Enter info model version"
                        />
                    </div>
                </div>

                {/* SWAspects 섹션 - Composite 타입일 때만 표시 */}
                {initGenInfo.idType === 'Comp' && (
                    <div className="sw-aspects-section">
                        <h3>Software Modules</h3>

                        {/* 사전 설정된 SW Modules 표시 */}
                        {swAspects && swAspects.length > 0 && (
                            <div className="pre-configured-modules">
                                <h4>Pre-configured ({swAspects.length})</h4>
                                <div className="modules-list">
                                    {swAspects.map((module, index) => (
                                        <div key={index} className="module-item pre-configured">
                                            <span className="module-info">
                                                <span className="module-name">{module.name}</span>
                                                <span className="module-id">{module.moduleID}</span>
                                            </span>
                                            <span className="pre-configured-badge">Pre-configured</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="sw-management-container">
                            {/* 선택된 모듈 목록 */}
                            <div className="selected-modules">
                                <h4>Selected ({selectedSWModules.length})</h4>
                                {selectedSWModules.length === 0 ? (
                                    <p className="no-modules">No modules selected</p>
                                ) : (
                                    <div className="modules-list">
                                        {selectedSWModules.map((module) => (
                                            <div key={module.moduleID} className="module-item">
                                                <span className="module-info">
                                                    <span className="module-name">{module.moduleName}</span>
                                                    <span className="module-id">{module.moduleID}</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    className="remove-btn"
                                                    onClick={() => handleSWModuleToggle(module)}
                                                    title="모듈 제거"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 사용 가능한 모듈 목록 */}
                            <div className="available-modules">
                                <h4>Available Modules</h4>
                                {loading ? (
                                    <div className="loading">Loading modules...</div>
                                ) : (
                                    <div className="sw-modules-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Module ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {swModules.map((module) => {
                                                    const isSelected = selectedSWModules.some(m => m.moduleID === module.moduleID);
                                                    return (
                                                        <tr key={module.moduleID} className={isSelected ? 'selected' : ''}>
                                                            <td>{module.moduleName}</td>
                                                            <td title={module.moduleID}>{module.moduleID}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className={`add-btn ${isSelected ? 'disabled' : ''}`}
                                                                    onClick={() => !isSelected && handleSWModuleToggle(module)}
                                                                    disabled={isSelected}
                                                                    title={isSelected ? 'Already selected' : 'Add module'}
                                                                >
                                                                    {isSelected ? 'Selected' : '+ Add'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* HWAspects 섹션 - Composite 타입일 때만 표시 */}
                {initGenInfo.idType === 'Comp' && (
                    <div className="hw-aspects-section">
                        <h3>Hardware Modules</h3>

                        {/* 사전 설정된 HW Module 표시 */}
                        {hwAspects && hwAspects.length > 0 && (
                            <div className="pre-configured-modules">
                                <h4>Pre-configured ({hwAspects.length})</h4>
                                <div className="modules-list">
                                    {hwAspects.map((module, index) => (
                                        <div key={index} className="module-item pre-configured">
                                            <span className="module-info">
                                                <span className="module-name">{module.name}</span>
                                                <span className="module-type">{module.moduleType}</span>
                                                {module.classifier && (
                                                    <span className="module-classifier">({module.classifier})</span>
                                                )}
                                            </span>
                                            <span className="pre-configured-badge">Pre-configured</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="sw-management-container">
                            {/* 선택된 HW 모듈 목록 */}
                            <div className="selected-modules">
                                <h4>Selected ({selectedHWModules.length})</h4>
                                {selectedHWModules.length === 0 ? (
                                    <p className="no-modules">No modules selected</p>
                                ) : (
                                    <div className="modules-list">
                                        {selectedHWModules.map((module) => (
                                            <div key={module.moduleID} className="module-item">
                                                <span className="module-info">
                                                    <span className="module-name">{module.moduleName}</span>
                                                    <span className="module-id">{module.moduleID}</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    className="remove-btn"
                                                    onClick={() => handleHWModuleToggle(module)}
                                                    title="Remove module"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 사용 가능한 HW 모듈 목록 */}
                            <div className="available-modules">
                                <h4>Available Modules</h4>
                                {hwLoading ? (
                                    <div className="loading">Loading modules...</div>
                                ) : (
                                    <div className="sw-modules-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Module ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {hwModules.map((module) => {
                                                    const isSelected = selectedHWModules.some(m => m.moduleID === module.moduleID);
                                                    return (
                                                        <tr key={module.moduleID} className={isSelected ? 'selected' : ''}>
                                                            <td>{module.moduleName}</td>
                                                            <td title={module.moduleID}>{module.moduleID}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className={`add-btn ${isSelected ? 'disabled' : ''}`}
                                                                    onClick={() => !isSelected && handleHWModuleToggle(module)}
                                                                    disabled={isSelected}
                                                                    title={isSelected ? 'Already selected' : 'Add module'}
                                                                >
                                                                    {isSelected ? 'Selected' : '+ Add'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default IDnTypePage;