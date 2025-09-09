import { useState, useEffect, useCallback } from 'react';
import { TreeNode } from '../utils/tree/TreeNode';
import { createTreeNode, getNodeAtPath, addNodeAtPath, removeNodeAtPath } from '../utils/tree/TreeUtils';
import { getServiceNodeLabel, getServiceNodeTooltip } from '../utils/tree/TreeNodeLabelUtils';

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

export function useServicesState(services = {}, onChange) {
    const [servicesState, setServicesState] = useState({
        noOfBasicService: services.noOfBasicService || '',
        noOfOptionalService: services.noOfOptionalService || '',
        serviceProfiles: []
    });

    // Services 트리 상태 직접 관리
    const [tree, setTree] = useState(() => servicesToTree(services));
    const [selectedNodePath, setSelectedNodePath] = useState([]);

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

    // props로 받은 services가 바뀔 때만 동기화 (초기 로드 시에만)
    useEffect(() => {
        if (services && Object.keys(services).length > 0) {
            console.log('ServicesPage - initializing from services:', services);
            setServicesState({
                noOfBasicService: services.noOfBasicService || '',
                noOfOptionalService: services.noOfOptionalService || '',
                serviceProfiles: services.serviceProfiles || []
            });
            const treeData = servicesToTree(services);
            console.log('ServicesPage - tree data:', treeData);
            setTree(treeData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 의존성 배열로 한 번만 실행

    // 선택 타입 판별
    const getSelectedType = useCallback(() => {
        if (selectedNodePath.length === 0) return 'profile';
        const node = getNodeAtPath(servicesState.serviceProfiles || [], selectedNodePath);
        if (!node) return 'profile';
        const data = node instanceof TreeNode ? node.getValue() : node;
        if (data.type) return 'profile';
        if (data.methodName) return 'method';
        if (data.name && data.type) return 'argspec';
        return 'profile';
    }, [selectedNodePath, servicesState.serviceProfiles]);

    const selectedType = getSelectedType();

    // 트리에서 노드 선택 (Services 전용 로직)
    const handleSelectNode = useCallback((path) => {
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
    }, [servicesState.serviceProfiles]);

    // Service Profile 입력 핸들러
    const handleServiceProfileChange = useCallback((e) => {
        const { name, value } = e.target;
        setServiceProfile(prev => ({ ...prev, [name]: value }));
    }, []);

    // Service Method 입력 핸들러
    const handleServiceMethodChange = useCallback((e) => {
        const { name, value } = e.target;
        setServiceMethod(prev => ({ ...prev, [name]: value }));
    }, []);

    // ArgSpec 입력 핸들러
    const handleArgSpecInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setArgSpecInput(prev => ({ ...prev, [name]: value }));
    }, []);

    // Additional Info 입력 핸들러
    const handleAdditionalInfoInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setAdditionalInfoInput(prev => ({ ...prev, [name]: value }));
    }, []);

    // Service Profile 추가 (Services 전용 로직)
    const handleAddServiceProfile = useCallback(() => {
        if (!serviceProfile.type || !serviceProfile.ID) {
            alert('Type and ID are required for Service Profile');
            return;
        }

        const newServiceProfileData = {
            type: serviceProfile.type,
            ID: serviceProfile.ID,
            PVType: serviceProfile.PVType,
            MOType: serviceProfile.MOType,
            path: serviceProfile.path,
            additionalInfo: serviceProfile.additionalInfo
        };

        // Services 트리에 추가 (루트 레벨에 추가)
        const newNode = createTreeNode(newServiceProfileData);
        console.log('ServicesPage - adding new serviceProfile:', newServiceProfileData);
        console.log('ServicesPage - created newNode:', newNode);
        const updatedTree = [...tree, newNode];
        console.log('ServicesPage - updatedTree:', updatedTree);
        setTree(updatedTree);

        // 즉시 ModuleState에 Services 데이터 전송
        const servicesData = treeToServices(updatedTree);
        servicesData.noOfBasicService = servicesState.noOfBasicService;
        servicesData.noOfOptionalService = servicesState.noOfOptionalService;
        if (onChange) {
            onChange(servicesData);
        }

        setServiceProfile({ type: '', ID: '', PVType: '', MOType: '', path: '', additionalInfo: [] });
        setSelectedNodePath([tree.length]);
    }, [serviceProfile, tree, servicesState.noOfBasicService, servicesState.noOfOptionalService, onChange]);

    // Service Profile 삭제 (Services 전용 로직)
    const handleRemoveServiceProfile = useCallback(() => {
        if (selectedNodePath.length === 0) return;

        // Services 트리에서 제거
        const updatedTree = removeNodeAtPath(tree, selectedNodePath);
        setTree(updatedTree);

        // 즉시 ModuleState에 Services 데이터 전송
        const servicesData = treeToServices(updatedTree);
        servicesData.noOfBasicService = servicesState.noOfBasicService;
        servicesData.noOfOptionalService = servicesState.noOfOptionalService;
        if (onChange) {
            onChange(servicesData);
        }

        setServiceProfile({ type: '', ID: '', PVType: '', MOType: '', path: '', additionalInfo: [] });
    }, [selectedNodePath, tree, servicesState.noOfBasicService, servicesState.noOfOptionalService, onChange]);

    // Service Method 추가 (Services 전용 로직)
    const handleAddServiceMethod = useCallback(() => {
        if (selectedNodePath.length === 0) {
            alert('Please select a Service Profile first');
            return;
        }
        if (!serviceMethod.methodName) {
            alert('Method Name is required');
            return;
        }

        const newServiceMethodData = {
            methodName: serviceMethod.methodName,
            retType: serviceMethod.retType,
            MOType: serviceMethod.MOType,
            reqProvType: serviceMethod.reqProvType
        };

        // Services 트리에 추가
        const newNode = createTreeNode(newServiceMethodData);
        const updatedTree = addNodeAtPath(tree, selectedNodePath, newNode);
        setTree(updatedTree);

        // 즉시 ModuleState에 Services 데이터 전송
        const servicesData = treeToServices(updatedTree);
        servicesData.noOfBasicService = servicesState.noOfBasicService;
        servicesData.noOfOptionalService = servicesState.noOfOptionalService;
        if (onChange) {
            onChange(servicesData);
        }

        setServiceMethod({ methodName: '', retType: '', MOType: '', reqProvType: '', argSpecs: [] });
    }, [selectedNodePath, serviceMethod, tree, servicesState.noOfBasicService, servicesState.noOfOptionalService, onChange]);

    // Service Method 삭제
    const handleRemoveServiceMethod = useCallback(() => {
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
    }, [selectedNodePath]);

    // ArgSpec 추가
    const handleAddArgSpec = useCallback(() => {
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
    }, [selectedNodePath, argSpecInput]);

    // ArgSpec 삭제
    const handleRemoveArgSpec = useCallback(() => {
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
    }, [selectedNodePath]);

    // Additional Info 추가/삭제
    const handleAddAdditionalInfo = useCallback(() => {
        if (additionalInfoInput.name && additionalInfoInput.value) {
            setServiceProfile(prev => ({
                ...prev,
                additionalInfo: [...prev.additionalInfo, additionalInfoInput]
            }));
            setAdditionalInfoInput({ name: '', value: '' });
        }
    }, [additionalInfoInput]);

    const handleRemoveAdditionalInfo = useCallback((idx) => {
        setServiceProfile(prev => ({
            ...prev,
            additionalInfo: prev.additionalInfo.filter((_, i) => i !== idx)
        }));
    }, []);

    // 트리뷰 재귀 렌더링
    const renderTree = useCallback((nodes, path = []) => (
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
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectNode(currentPath);
                            }}
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
    ), [selectedNodePath, handleSelectNode]);

    return {
        // 상태
        servicesState,
        setServicesState,
        tree,
        selectedNodePath,
        serviceProfile,
        serviceMethod,
        argSpecInput,
        additionalInfoInput,
        selectedType,

        // 이벤트 핸들러
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
    };
}
