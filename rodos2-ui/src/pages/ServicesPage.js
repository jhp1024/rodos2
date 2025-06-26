import React, { useState, useEffect, useRef } from 'react';
import '../styles/ServicesPage.css';
import { TreeNode } from '../utils/TreeNode';
import { addNodeAtPath, removeNodeAtPath, createTreeNode, getNodeAtPath, getParentPath } from '../utils/TreeUtils';
import { getServiceNodeLabel, getServiceNodeTooltip } from '../utils/TreeNodeLabelUtils';
import { SERVICE_TYPE_OPTIONS, PV_TYPE_OPTIONS, MO_TYPE_OPTIONS, REQ_PROV_TYPE_OPTIONS } from '../utils/Options';

// services <-> tree 변환 유틸리티
function servicesToTree(services) {
    if (!services || !services.serviceProfiles) return [];

    return services.serviceProfiles.map(profile => {
        const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
        const methods = (profileData.serviceMethods || []).map(method => {
            const methodData = method instanceof TreeNode ? method.getValue() : method;
            const argSpecs = (methodData.argSpecs || []).map(argSpec =>
                createTreeNode(argSpec)
            );
            return createTreeNode(methodData, argSpecs);
        });
        return createTreeNode(profileData, methods);
    });
}

function treeToServices(tree) {
    return {
        noOfBasicService: '', // 이 값은 별도로 관리
        noOfOptionalService: '', // 이 값은 별도로 관리
        serviceProfiles: tree.map(node => {
            const nodeData = node instanceof TreeNode ? node.getValue() : node;
            return {
                ...nodeData,
                serviceMethods: node.hasChildren ? node.children.map(methodNode => {
                    const methodData = methodNode instanceof TreeNode ? methodNode.getValue() : methodNode;
                    return {
                        ...methodData,
                        argSpecs: methodNode.hasChildren ? methodNode.children.map(argNode =>
                            argNode instanceof TreeNode ? argNode.getValue() : argNode
                        ) : []
                    };
                }) : []
            };
        })
    };
}

function ServicesPage({ services = {}, onChange }) {
    const [servicesState, setServicesState] = useState({
        noOfBasicService: services.noOfBasicService || '',
        noOfOptionalService: services.noOfOptionalService || '',
        serviceProfiles: []
    });
    const [tree, setTree] = useState(servicesToTree(services));
    const [selectedNodePath, setSelectedNodePath] = useState([]);
    const isInitialized = useRef(false);

    // Service Profile 입력
    const [serviceProfile, setServiceProfile] = useState({
        type: '',
        ID: '',
        PVType: '',
        MOType: '',
        path: '',
        additionalInfo: []
    });

    // Service Method 입력
    const [serviceMethod, setServiceMethod] = useState({
        methodName: '',
        retType: '',
        MOType: '',
        reqProvType: '',
        argSpecs: []
    });

    // ArgSpec 입력
    const [argSpecInput, setArgSpecInput] = useState({ name: '', type: '' });

    // Additional Info 입력
    const [additionalInfoInput, setAdditionalInfoInput] = useState({ name: '', value: '' });

    // 선택 타입 판별
    const getSelectedType = () => {
        if (selectedNodePath.length === 0) return 'profile';
        const node = getNodeAtPath(servicesState.serviceProfiles || [], selectedNodePath);
        if (!node) return 'profile';
        const data = node instanceof TreeNode ? node.getValue() : node;
        if (data.type) return 'profile';
        if (data.methodName) return 'method';
        if (data.name && data.type) return 'argspec';
        return 'profile';
    };
    const selectedType = getSelectedType();

    // props로 받은 services가 바뀔 때만 동기화 (초기 로드 시에만)
    useEffect(() => {
        if (!isInitialized.current) {
            setServicesState({
                noOfBasicService: services.noOfBasicService || '',
                noOfOptionalService: services.noOfOptionalService || '',
                serviceProfiles: services.serviceProfiles || []
            });
            setTree(servicesToTree(services));
            isInitialized.current = true;
        }
    }, [services]);

    // 트리 상태가 변경될 때마다 부모 컴포넌트에 동기화
    useEffect(() => {
        if (isInitialized.current) {
            const convertedData = treeToServices(tree);
            convertedData.noOfBasicService = servicesState.noOfBasicService;
            convertedData.noOfOptionalService = servicesState.noOfOptionalService;
            onChange(convertedData);
        }
    }, [tree, servicesState.noOfBasicService, servicesState.noOfOptionalService, onChange]);

    // 트리에서 노드 선택
    const handleSelectNode = (path) => {
        setSelectedNodePath(path);

        if (path.length === 0) {
            // Root level - clear all forms
            setServiceProfile({ type: '', ID: '', PVType: '', MOType: '', path: '', additionalInfo: [] });
            setServiceMethod({ methodName: '', retType: '', MOType: '', reqProvType: '', argSpecs: [] });
            setArgSpecInput({ name: '', type: '' });
            return;
        }

        const currentProfiles = Array.isArray(servicesState.serviceProfiles) ? servicesState.serviceProfiles : [];

        if (path.length === 1) {
            // Service Profile level
            const profile = currentProfiles[path[0]];
            if (profile) {
                const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
                setServiceProfile({
                    type: profileData.type || '',
                    ID: profileData.ID || '',
                    PVType: profileData.PVType || '',
                    MOType: profileData.MOType || '',
                    path: profileData.path || '',
                    additionalInfo: profileData.additionalInfo || []
                });
                setServiceMethod({ methodName: '', retType: '', MOType: '', reqProvType: '', argSpecs: [] });
                setArgSpecInput({ name: '', type: '' });
            }
        } else if (path.length === 2) {
            // Service Method level
            const profile = currentProfiles[path[0]];
            if (profile) {
                const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
                const methods = profileData.serviceMethods || [];
                const method = methods[path[1]];

                if (method) {
                    const methodData = method instanceof TreeNode ? method.getValue() : method;
                    setServiceMethod({
                        methodName: methodData.methodName || '',
                        retType: methodData.retType || '',
                        MOType: methodData.MOType || '',
                        reqProvType: methodData.reqProvType || '',
                        argSpecs: methodData.argSpecs || []
                    });
                    setArgSpecInput({ name: '', type: '' });
                }
            }
        } else if (path.length === 3) {
            // ArgSpec level
            const profile = currentProfiles[path[0]];
            if (profile) {
                const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
                const methods = profileData.serviceMethods || [];
                const method = methods[path[1]];

                if (method) {
                    const methodData = method instanceof TreeNode ? method.getValue() : method;
                    const argSpecs = methodData.argSpecs || [];
                    const argSpec = argSpecs[path[2]];

                    if (argSpec) {
                        const argSpecData = argSpec instanceof TreeNode ? argSpec.getValue() : argSpec;
                        setArgSpecInput({
                            name: argSpecData.name || '',
                            type: argSpecData.type || ''
                        });
                    }
                }
            }
        }
    };

    // Service Profile 입력 핸들러
    const handleServiceProfileChange = (e) => {
        const { name, value } = e.target;
        setServiceProfile(prev => ({ ...prev, [name]: value }));
    };

    // Service Method 입력 핸들러
    const handleServiceMethodChange = (e) => {
        const { name, value } = e.target;
        setServiceMethod(prev => ({ ...prev, [name]: value }));
    };

    // ArgSpec 입력 핸들러
    const handleArgSpecInputChange = (e) => {
        const { name, value } = e.target;
        setArgSpecInput(prev => ({ ...prev, [name]: value }));
    };

    // Additional Info 입력 핸들러
    const handleAdditionalInfoInputChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfoInput(prev => ({ ...prev, [name]: value }));
    };

    // Service Profile 추가
    const handleAddServiceProfile = () => {
        if (!serviceProfile.type || !serviceProfile.ID) {
            alert('Type and ID are required for Service Profile');
            return;
        }

        const newServiceProfile = createTreeNode({
            type: serviceProfile.type,
            ID: serviceProfile.ID,
            PVType: serviceProfile.PVType,
            MOType: serviceProfile.MOType,
            path: serviceProfile.path,
            additionalInfo: serviceProfile.additionalInfo
        });

        setTree(prev => [...prev, newServiceProfile]);
        setServiceProfile({ type: '', ID: '', PVType: '', MOType: '', path: '', additionalInfo: [] });
        setSelectedNodePath([tree.length]);
    };

    // Service Profile 삭제
    const handleRemoveServiceProfile = () => {
        if (selectedNodePath.length === 0) return;
        setTree(prev => removeNodeAtPath(prev, selectedNodePath));
        setSelectedNodePath([]);
        setServiceProfile({ type: '', ID: '', PVType: '', MOType: '', path: '', additionalInfo: [] });
    };

    // Service Method 추가
    const handleAddServiceMethod = () => {
        if (selectedNodePath.length === 0) {
            alert('Please select a Service Profile first');
            return;
        }
        if (!serviceMethod.methodName) {
            alert('Method Name is required');
            return;
        }

        const newServiceMethod = createTreeNode({
            methodName: serviceMethod.methodName,
            retType: serviceMethod.retType,
            MOType: serviceMethod.MOType,
            reqProvType: serviceMethod.reqProvType
        });

        setTree(prev => addNodeAtPath(prev, selectedNodePath, newServiceMethod));
        setServiceMethod({ methodName: '', retType: '', MOType: '', reqProvType: '', argSpecs: [] });
    };

    // Service Method 삭제
    const handleRemoveServiceMethod = () => {
        if (selectedNodePath.length < 2) return;
        setServicesState(s => {
            const currentProfiles = Array.isArray(s.serviceProfiles) ? s.serviceProfiles : [];
            const profileIdx = selectedNodePath[0];
            const methodIdx = selectedNodePath[1];
            const profile = currentProfiles[profileIdx];

            if (profile) {
                const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
                const updatedMethods = (profileData.serviceMethods || []).filter((_, idx) => idx !== methodIdx);
                const updatedProfile = createTreeNode({
                    ...profileData,
                    serviceMethods: updatedMethods
                });

                const updatedProfiles = currentProfiles.map((p, idx) =>
                    idx === profileIdx ? updatedProfile : p
                );

                return { ...s, serviceProfiles: updatedProfiles };
            }
            return s;
        });
        setSelectedNodePath([selectedNodePath[0]]);
        setServiceMethod({ methodName: '', retType: '', MOType: '', reqProvType: '', argSpecs: [] });
    };

    // ArgSpec 추가
    const handleAddArgSpec = () => {
        if (selectedNodePath.length < 2) {
            alert('Please select a Method first');
            return;
        }
        if (!argSpecInput.name || !argSpecInput.type) {
            alert('Argument Name and Type are required');
            return;
        }

        setServicesState(s => {
            const currentProfiles = Array.isArray(s.serviceProfiles) ? s.serviceProfiles : [];
            const profileIdx = selectedNodePath[0];
            const methodIdx = selectedNodePath[1];
            const profile = currentProfiles[profileIdx];

            if (profile) {
                const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
                const methods = profileData.serviceMethods || [];
                const method = methods[methodIdx];

                if (method) {
                    const methodData = method instanceof TreeNode ? method.getValue() : method;
                    const updatedMethod = createTreeNode({
                        ...methodData,
                        argSpecs: [...(methodData.argSpecs || []), { ...argSpecInput }]
                    });

                    const updatedMethods = methods.map((m, idx) =>
                        idx === methodIdx ? updatedMethod : m
                    );

                    const updatedProfile = createTreeNode({
                        ...profileData,
                        serviceMethods: updatedMethods
                    });

                    const updatedProfiles = currentProfiles.map((p, idx) =>
                        idx === profileIdx ? updatedProfile : p
                    );

                    return { ...s, serviceProfiles: updatedProfiles };
                }
            }
            return s;
        });

        setArgSpecInput({ name: '', type: '' });
    };

    // ArgSpec 삭제
    const handleRemoveArgSpec = () => {
        if (selectedNodePath.length < 3) return;
        setServicesState(s => {
            const currentProfiles = Array.isArray(s.serviceProfiles) ? s.serviceProfiles : [];
            const profileIdx = selectedNodePath[0];
            const methodIdx = selectedNodePath[1];
            const argIdx = selectedNodePath[2];
            const profile = currentProfiles[profileIdx];

            if (profile) {
                const profileData = profile instanceof TreeNode ? profile.getValue() : profile;
                const methods = profileData.serviceMethods || [];
                const method = methods[methodIdx];

                if (method) {
                    const methodData = method instanceof TreeNode ? method.getValue() : method;
                    const updatedMethod = createTreeNode({
                        ...methodData,
                        argSpecs: (methodData.argSpecs || []).filter((_, idx) => idx !== argIdx)
                    });

                    const updatedMethods = methods.map((m, idx) =>
                        idx === methodIdx ? updatedMethod : m
                    );

                    const updatedProfile = createTreeNode({
                        ...profileData,
                        serviceMethods: updatedMethods
                    });

                    const updatedProfiles = currentProfiles.map((p, idx) =>
                        idx === profileIdx ? updatedProfile : p
                    );

                    return { ...s, serviceProfiles: updatedProfiles };
                }
            }
            return s;
        });
        setSelectedNodePath([selectedNodePath[0], selectedNodePath[1]]);
        setArgSpecInput({ name: '', type: '' });
    };

    // Additional Info 추가/삭제
    const handleAddAdditionalInfo = () => {
        if (additionalInfoInput.name && additionalInfoInput.value) {
            setServiceProfile(prev => ({
                ...prev,
                additionalInfo: [...prev.additionalInfo, additionalInfoInput]
            }));
            setAdditionalInfoInput({ name: '', value: '' });
        }
    };
    const handleRemoveAdditionalInfo = (idx) => {
        setServiceProfile(prev => ({
            ...prev,
            additionalInfo: prev.additionalInfo.filter((_, i) => i !== idx)
        }));
    };

    // 트리뷰 재귀 렌더링 - 개선된 버전
    const renderTree = (nodes, path = []) => (
        <ul className="service-tree">
            {nodes.map((node, idx) => {
                const currentPath = [...path, idx];
                const isSelected = JSON.stringify(currentPath) === JSON.stringify(selectedNodePath);
                const nodeLabel = getServiceNodeLabel(node);
                const nodeTooltip = getServiceNodeTooltip(node);
                const nodeData = node instanceof TreeNode ? node.getValue() : node;
                const dataType = nodeData.type ? 'service-profile' : nodeData.methodName ? 'service-method' : 'service-argspec';

                return (
                    <li key={idx}>
                        <div
                            className={`service-tree-node${isSelected ? ' selected' : ''}`}
                            onClick={() => handleSelectNode(currentPath)}
                            title={nodeTooltip}
                            data-type={dataType}
                        >
                            {nodeLabel}
                        </div>
                        {node.hasChildren && node.hasChildren() && renderTree(node.children, currentPath)}
                    </li>
                );
            })}
        </ul>
    );

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