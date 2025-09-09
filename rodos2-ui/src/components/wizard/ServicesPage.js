import React from 'react';
import '../../styles/wizard/ServicesPage.css';
import { SERVICE_TYPE_OPTIONS, PV_TYPE_OPTIONS, MO_TYPE_OPTIONS, REQ_PROV_TYPE_OPTIONS } from '../../utils/Options';
import { useServicesState } from '../../hooks/useServicesState';

function ServicesPage({ services = {}, onChange }) {
    const {
        servicesState,
        setServicesState,
        tree,
        selectedNodePath,
        serviceProfile,
        serviceMethod,
        argSpecInput,
        additionalInfoInput,
        selectedType,
        handleSelectNode,
        handleServiceProfileChange,
        handleServiceMethodChange,
        handleArgSpecInputChange,
        handleAdditionalInfoInputChange,
        handleAddServiceProfile,
        handleRemoveServiceProfile,
        handleAddServiceMethod,
        handleRemoveServiceMethod,
        handleAddArgSpec,
        handleRemoveArgSpec,
        handleAddAdditionalInfo,
        handleRemoveAdditionalInfo,
        renderTree
    } = useServicesState(services, onChange);



    return (
        <div className="services-page" style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
            {/* 상단 서비스 개수 입력 */}
            <div className="services-header-compact">
                <div className="service-group-compact">
                    <label>Number of Basic Services</label>
                    <input type="text" value={servicesState.noOfBasicService || ''} onChange={e => setServicesState(s => ({ ...s, noOfBasicService: e.target.value }))} placeholder="Enter number" />
                </div>
                <div className="service-group-compact">
                    <label>Number of Optional Services</label>
                    <input type="text" value={servicesState.noOfOptionalService || ''} onChange={e => setServicesState(s => ({ ...s, noOfOptionalService: e.target.value }))} placeholder="Enter number" />
                </div>
            </div>
            <div className="services-content-flex-compact" style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
                {/* 좌측 입력폼 */}
                <div className="service-input-area-compact" style={{ flex: '1 1 0', minWidth: 0, maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* ServiceProfile 입력 영역 */}
                    <div className="input-block">
                        <div className="input-title">Service Profile</div>
                        <div className="service-row">
                            <div className="service-group">
                                <label>Type</label>
                                <select name="type" value={serviceProfile.type} onChange={handleServiceProfileChange}>
                                    {SERVICE_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="service-group">
                                <label>ID</label>
                                <input name="ID" value={serviceProfile.ID} onChange={handleServiceProfileChange} placeholder="Enter ID" />
                            </div>
                        </div>
                        <div className="service-row">
                            <div className="service-group">
                                <label>PV Type</label>
                                <select name="PVType" value={serviceProfile.PVType} onChange={handleServiceProfileChange}>
                                    {PV_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="service-group">
                                <label>MO Type</label>
                                <select name="MOType" value={serviceProfile.MOType} onChange={handleServiceProfileChange}>
                                    {MO_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="service-group">
                            <label>Path</label>
                            <input name="path" value={serviceProfile.path} onChange={handleServiceProfileChange} placeholder="Enter path" />
                        </div>
                        <div className="service-group">
                            <label>Additional Info</label>
                            <div className="service-row">
                                <input type="text" name="name" placeholder="Name" value={additionalInfoInput.name} onChange={handleAdditionalInfoInputChange} />
                                <input type="text" name="value" placeholder="Value" value={additionalInfoInput.value} onChange={handleAdditionalInfoInputChange} />
                                <button type="button" className="service-btn" onClick={handleAddAdditionalInfo}>Add</button>
                            </div>
                            {serviceProfile.additionalInfo.length > 0 && (
                                <div className="additional-info-list">
                                    {serviceProfile.additionalInfo.map((info, idx) => (
                                        <div key={idx} className="info-item">
                                            <span>{info.name}: {info.value}</span>
                                            <button type="button" className="service-btn small" onClick={() => handleRemoveAdditionalInfo(idx)}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="service-actions">
                            <button type="button" className="service-btn" onClick={handleAddServiceProfile}>Add</button>
                            <button type="button" className="service-btn danger" onClick={handleRemoveServiceProfile} disabled={selectedNodePath.length === 0}>Remove</button>
                        </div>
                    </div>
                    {/* Method 입력 영역 (ServiceProfile 선택 시만 활성화) */}
                    <div className="input-block" style={{ opacity: selectedNodePath.length > 0 ? 1 : 0.5, pointerEvents: selectedNodePath.length > 0 ? 'auto' : 'none' }}>
                        <div className="input-title">Method</div>
                        <div className="service-row">
                            <div className="service-group">
                                <label>Method Name</label>
                                <input name="methodName" value={serviceMethod.methodName} onChange={handleServiceMethodChange} placeholder="Enter method name" />
                            </div>
                            <div className="service-group">
                                <label>Return Type</label>
                                <input name="retType" value={serviceMethod.retType} onChange={handleServiceMethodChange} placeholder="Enter return type" />
                            </div>
                        </div>
                        <div className="service-row">
                            <div className="service-group">
                                <label>MO Type</label>
                                <select name="MOType" value={serviceMethod.MOType} onChange={handleServiceMethodChange}>
                                    {MO_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="service-group">
                                <label>Req/Prov Type</label>
                                <select name="reqProvType" value={serviceMethod.reqProvType} onChange={handleServiceMethodChange}>
                                    {REQ_PROV_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="service-actions">
                            <button type="button" className="service-btn" onClick={handleAddServiceMethod}>Add</button>
                            <button type="button" className="service-btn danger" onClick={handleRemoveServiceMethod} disabled={selectedNodePath.length < 2}>Remove</button>
                        </div>
                    </div>
                    {/* ArgSpec 입력 영역 (Method 선택 시만 활성화) */}
                    <div className="input-block" style={{ opacity: selectedNodePath.length > 1 ? 1 : 0.5, pointerEvents: selectedNodePath.length > 1 ? 'auto' : 'none' }}>
                        <div className="input-title">ArgSpec</div>
                        <div className="service-row">
                            <div className="service-group">
                                <label>Argument Name</label>
                                <input type="text" name="name" placeholder="Argument Name" value={argSpecInput.name} onChange={handleArgSpecInputChange} />
                            </div>
                            <div className="service-group">
                                <label>Argument Type</label>
                                <input type="text" name="type" placeholder="Argument Type" value={argSpecInput.type} onChange={handleArgSpecInputChange} />
                            </div>
                        </div>
                        <div className="service-actions">
                            <button type="button" className="service-btn" onClick={handleAddArgSpec}>Add</button>
                            <button type="button" className="service-btn danger" onClick={handleRemoveArgSpec} disabled={selectedNodePath.length < 3}>Remove</button>
                        </div>
                    </div>
                </div>
                {/* 우측 트리뷰 */}
                <div className="service-tree-area-compact" style={{ flex: '1 1 0', minWidth: 0, maxHeight: '70vh', overflowY: 'auto' }}>
                    {renderTree(tree)}
                </div>
            </div>
        </div>
    );
}

export default ServicesPage; 