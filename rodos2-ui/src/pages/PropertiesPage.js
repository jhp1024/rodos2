import React, { useEffect, useRef, useState } from 'react';
import '../styles/PropertiesPage.css';
import {
    BIT_OPTIONS,
    COMPILER_NAME_OPTIONS,
    COMPLEX_TYPE_OPTIONS,
    CPU_ARCH_OPTIONS,
    DEPENDENCY_TYPE_OPTIONS,
    INSTANCE_TYPES_OPTIONS,
    OP_TYPES_OPTIONS,
    OS_NAME_OPTIONS,
    PROPERTY_TABS,
    TYPE_OPTIONS, UNIT_OPTIONS,
    getCompilerVersionOptions,
    getOSVersionOptions
} from '../utils/Options';
import { TreeNode } from '../utils/TreeNode';
import { getNodeLabel, getNodeTooltip } from '../utils/TreeNodeLabelUtils';
import { addNodeAtPath, createTreeNode, getNodeAtPath, getParentPath, removeNodeAtPath } from '../utils/TreeUtils';

function PropertiesPage({ properties = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('property');
    const [propertiesState, setPropertiesState] = useState(properties);
    const [selectedNodePath, setSelectedNodePath] = useState([]);
    const [typeInput, setTypeInput] = useState('');
    const [unitInput, setUnitInput] = useState('');
    const [executionInput, setExecutionInput] = useState({
        priorty: '',
        opType: '',
        hardRT: '',
        timeConstraint: '',
        instanceType: '',
    });
    const [libraryInput, setLibraryInput] = useState({ name: '', version: '' });

    // Organization 추가 정보 입력
    const [additionalInfoInput, setAdditionalInfoInput] = useState({ name: '', value: '' });

    // OS 버전 옵션 상태
    const [osVersionOptions, setOsVersionOptions] = useState([{ value: '', label: 'Select Version' }]);

    // Property 입력
    const [property, setProperty] = useState({
        complexType: '',
        name: '',
        complex: '',
        complexName: '',
        type: '',
        unit: '',
        value: '',
        description: '',
    });

    const isInitialized = useRef(false);

    // props로 받은 properties가 바뀔 때만 동기화 (초기 로드 시에만)
    useEffect(() => {
        if (!isInitialized.current) {
            const initialProperties = {
                osType: properties.osType || { type: '', bit: '', version: '' },
                compilerType: properties.compilerType || {
                    osName: '',
                    verRangeOS: { min: '', max: '' },
                    compilerName: '',
                    verRangeCompiler: { min: '', max: '' },
                    bitsnCPUarch: ''
                },
                executionTypes: properties.executionTypes || [],
                libraries: properties.libraries || [],
                organization: properties.organization || { owner: '', dependency: '', orgMemberType: { moduleID: '', dependency: '' }, additionalInfo: [] },
                propertyTree: properties.propertyTree || []
            };
            setPropertiesState(initialProperties);
            isInitialized.current = true;
        }
    }, [properties]);

    // Organization 추가 정보 입력
    useEffect(() => {
        if (propertiesState.osType.type) {
            const versionOptions = getOSVersionOptions(propertiesState.osType.type);
            setOsVersionOptions(versionOptions);
        }
    }, [propertiesState.osType.type]);

    // 트리 상태가 변경될 때마다 부모 컴포넌트에 동기화
    useEffect(() => {
        if (isInitialized.current) {
            onChange(propertiesState);
        }
    }, [propertiesState, onChange]);

    const handlePropertyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProperty(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 트리에서 노드 선택
    const handleSelectNode = (path) => {
        setSelectedNodePath(path);

        // 선택된 노드의 정보를 입력 폼에 표시
        const selectedNode = getNodeAtPath(propertiesState.propertyTree || [], path);
        if (selectedNode) {
            const nodeProperty = selectedNode.getValue();
            setProperty({
                complexType: nodeProperty.complexType || '',
                name: nodeProperty.name || '',
                complex: nodeProperty.complex || '',
                complexName: nodeProperty.complexName || '',
                type: nodeProperty.type || '',
                unit: nodeProperty.unit || '',
                value: nodeProperty.value || '',
                description: nodeProperty.description || '',
            });
        }
    };

    // 트리 구조에 새 노드 추가 (Java 방식과 유사하게 개선)
    const handleAdd = () => {
        let nodeData = {};
        if (property.complexType === '' || property.complexType === 'NONE') {
            nodeData = {
                complexType: property.complexType,
                name: property.name,
                type: property.type,
                unit: property.unit,
                value: property.value,
                description: property.description,
            };
        } else if (property.complexType === 'ARRAY') {
            nodeData = {
                complexType: property.complexType,
                name: property.name,
                type: property.type,
                unit: property.unit,
                value: property.value,
                description: property.description,
            };
        } else if (property.complexType === 'CLASS') {
            nodeData = {
                complexType: property.complexType,
                complexName: property.complexName,
                name: property.name,
                type: property.type,
                unit: property.unit,
                value: property.value,
                description: property.description,
            };
        } else if (property.complexType === 'POINTER') {
            nodeData = {
                complexType: property.complexType,
                name: property.name,
                inDataType: property.inDataType,
                description: property.description,
            };
        }

        const newNode = createTreeNode(nodeData);

        setPropertiesState(s => {
            const currentTree = Array.isArray(s.propertyTree) ? s.propertyTree : [];
            const newTree = selectedNodePath.length === 0
                ? [...currentTree, newNode]
                : addNodeAtPath(currentTree, selectedNodePath, newNode);

            return {
                ...s,
                propertyTree: newTree
            };
        });

        // 입력 폼 초기화
        setProperty({
            complexType: '', name: '', complex: '', complexName: '', type: '', unit: '', description: '', value: ''
        });
        setTypeInput('');
        setUnitInput('');

        // 새로 추가된 노드의 경로 계산하여 선택
        const newPath = selectedNodePath.length === 0
            ? [propertiesState.propertyTree ? propertiesState.propertyTree.length : 0]
            : [...selectedNodePath, getNodeAtPath(propertiesState.propertyTree || [], selectedNodePath).getChildCount()];
        setSelectedNodePath(newPath);
    };

    // 트리에서 노드 삭제 (Java 방식과 유사하게 개선)
    const handleRemove = () => {
        if (selectedNodePath.length === 0) return;

        setPropertiesState(s => {
            const currentTree = Array.isArray(s.propertyTree) ? s.propertyTree : [];
            const newTree = removeNodeAtPath(currentTree, selectedNodePath);

            return {
                ...s,
                propertyTree: newTree
            };
        });

        // 부모 노드로 선택 이동 (Java 방식과 동일)
        const parentPath = getParentPath(selectedNodePath);
        setSelectedNodePath(parentPath);

        // 입력 폼 초기화
        setProperty({
            complexType: '', name: '', complex: '', complexName: '', type: '', unit: '', description: '', value: ''
        });
    };

    // 트리뷰 재귀 렌더링 (개선된 라벨링 적용)
    const renderTree = (nodes, path = []) => (
        <ul className="property-tree">
            {nodes.map((node, idx) => {
                const currentPath = [...path, idx];
                const isSelected = JSON.stringify(currentPath) === JSON.stringify(selectedNodePath);
                const nodeLabel = getNodeLabel(node);
                const nodeTooltip = getNodeTooltip(node);
                const nodeProperty = node instanceof TreeNode ? node.getValue() : node;
                const complexType = nodeProperty.complexType || nodeProperty.complex || 'NONE';
                const dataType = complexType.toLowerCase();

                return (
                    <li key={idx}>
                        <div
                            className={`property-tree-node${isSelected ? ' selected' : ''}`}
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

    // OS/GPU 탭 입력 핸들러
    const handleOsTypeChange = (e) => {
        const { name, value } = e.target;
        setPropertiesState(s => ({ ...s, osType: { ...s.osType, [name]: value } }));

        // OS 타입이 변경되면 버전 옵션 업데이트
        if (name === 'type') {
            const versionOptions = getOSVersionOptions(value);
            setOsVersionOptions(versionOptions);
            // OS 타입이 변경되면 버전도 초기화
            setPropertiesState(s => ({
                ...s,
                osType: {
                    ...s.osType,
                    [name]: value,
                    version: ''
                }
            }));
        }
    };

    // CompilerType 입력 핸들러
    const handleCompilerTypeChange = (e) => {
        const { name, value } = e.target;
        setPropertiesState(s => ({ ...s, compilerType: { ...s.compilerType, [name]: value } }));
    };

    // ExecutionType 추가/삭제
    const handleAddExecution = () => {
        setPropertiesState(s => ({ ...s, executionTypes: [...s.executionTypes, executionInput] }));
        setExecutionInput({ priorty: '', opType: '', hardRT: '', timeConstraint: '', instanceType: '' });
    };
    const handleRemoveExecution = (idx) => {
        setPropertiesState(s => ({ ...s, executionTypes: s.executionTypes.filter((_, i) => i !== idx) }));
    };
    const handleExecutionInputChange = (e) => {
        const { name, value } = e.target;
        setExecutionInput(prev => ({ ...prev, [name]: value }));
    };

    // Libraries 추가/삭제
    const handleAddLibrary = () => {
        setPropertiesState(s => ({ ...s, libraries: [...s.libraries, libraryInput] }));
        setLibraryInput({ name: '', version: '' });
    };
    const handleRemoveLibrary = (idx) => {
        setPropertiesState(s => ({ ...s, libraries: s.libraries.filter((_, i) => i !== idx) }));
    };
    const handleLibraryInputChange = (e) => {
        const { name, value } = e.target;
        setLibraryInput(prev => ({ ...prev, [name]: value }));
    };

    // Organization 탭 입력 핸들러
    const handleOrganizationChange = (e) => {
        const { name, value } = e.target;
        setPropertiesState(s => ({
            ...s,
            organization: {
                ...s.organization,
                [name]: value
            }
        }));
    };

    // Organization의 OrgMemberType 변경 핸들러
    const handleOrgMemberTypeChange = (e) => {
        const { name, value } = e.target;
        setPropertiesState(s => ({
            ...s,
            organization: {
                ...s.organization,
                orgMemberType: {
                    ...s.organization.orgMemberType,
                    [name]: value
                }
            }
        }));
    };

    // Additional Info 추가/삭제
    const handleAddAdditionalInfo = () => {
        if (additionalInfoInput.name && additionalInfoInput.value) {
            setPropertiesState(s => ({
                ...s,
                organization: {
                    ...s.organization,
                    additionalInfo: [...s.organization.additionalInfo, additionalInfoInput]
                }
            }));
            setAdditionalInfoInput({ name: '', value: '' });
        }
    };

    const handleRemoveAdditionalInfo = (idx) => {
        setPropertiesState(s => ({
            ...s,
            organization: {
                ...s.organization,
                additionalInfo: s.organization.additionalInfo.filter((_, i) => i !== idx)
            }
        }));
    };

    const handleAdditionalInfoInputChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfoInput(prev => ({ ...prev, [name]: value }));
    };

    // Property 입력폼 렌더링 (ComplexType에 따라 다르게)
    const renderPropertyForm = () => {
        if (property.complexType === '' || property.complexType === 'NONE') {
            return <>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Type</label><select name="type" value={property.type} onChange={e => { handlePropertyChange(e); setTypeInput(''); }}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.type === 'custom' && (<input type="text" name="type" placeholder="직접입력" value={typeInput} onChange={e => { setTypeInput(e.target.value); setProperty(prev => ({ ...prev, type: e.target.value })); }} />)}</div>
                <div className="property-group"><label>Unit</label><select name="unit" value={property.unit} onChange={e => { handlePropertyChange(e); setUnitInput(''); }}>{UNIT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.unit === 'custom' && (<input type="text" name="unit" placeholder="직접입력" value={unitInput} onChange={e => { setUnitInput(e.target.value); setProperty(prev => ({ ...prev, unit: e.target.value })); }} />)}</div>
                <div className="property-group"><label>Value</label><input name="value" value={property.value} onChange={handlePropertyChange} /></div>
            </>;
        } else if (property.complexType === 'ARRAY') {
            return <>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Type</label><select name="type" value={property.type} onChange={e => { handlePropertyChange(e); setTypeInput(''); }}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.type === 'custom' && (<input type="text" name="type" placeholder="직접입력" value={typeInput} onChange={e => { setTypeInput(e.target.value); setProperty(prev => ({ ...prev, type: e.target.value })); }} />)}</div>
                <div className="property-group"><label>Unit</label><select name="unit" value={property.unit} onChange={e => { handlePropertyChange(e); setUnitInput(''); }}>{UNIT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.unit === 'custom' && (<input type="text" name="unit" placeholder="직접입력" value={unitInput} onChange={e => { setUnitInput(e.target.value); setProperty(prev => ({ ...prev, unit: e.target.value })); }} />)}</div>
                <div className="property-group"><label>Value (2D Array)</label><textarea name="value" value={property.value} onChange={handlePropertyChange} placeholder="예: [[1,2],[3,4]]" /></div>
            </>;
        } else if (property.complexType === 'CLASS') {
            return <>
                <div className="property-group"><label>Complex Name</label><input name="complexName" value={property.complexName} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Type</label><select name="type" value={property.type} onChange={e => { handlePropertyChange(e); setTypeInput(''); }}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.type === 'custom' && (<input type="text" name="type" placeholder="직접입력" value={typeInput} onChange={e => { setTypeInput(e.target.value); setProperty(prev => ({ ...prev, type: e.target.value })); }} />)}</div>
                <div className="property-group"><label>Unit</label><select name="unit" value={property.unit} onChange={e => { handlePropertyChange(e); setUnitInput(''); }}>{UNIT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.unit === 'custom' && (<input type="text" name="unit" placeholder="직접입력" value={unitInput} onChange={e => { setUnitInput(e.target.value); setProperty(prev => ({ ...prev, unit: e.target.value })); }} />)}</div>
                <div className="property-group"><label>Value</label><input name="value" value={property.value} onChange={handlePropertyChange} /></div>
            </>;
        } else if (property.complexType === 'POINTER') {
            return <>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>In Data Type</label><select name="inDataType" value={property.inDataType} onChange={handlePropertyChange}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select></div>
            </>;
        }
        return null;
    };

    return (
        <div className="properties-page">
            <div className="properties-tabs">
                {PROPERTY_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`properties-tab${activeTab === tab.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {activeTab === 'property' && (
                <div className="properties-page-flex">
                    <div className="property-input-area">
                        <div className="property-group">
                            <label>Complex Type</label>
                            <select name="complexType" value={property.complexType} onChange={handlePropertyChange}>
                                {COMPLEX_TYPE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        {renderPropertyForm()}
                        <div className="property-group"><label>Description</label><textarea name="description" value={property.description} onChange={handlePropertyChange} /></div>
                        <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                            <button type="button" className="property-btn" onClick={handleAdd}>Add</button>
                            <button type="button" className="property-btn" onClick={handleRemove} disabled={selectedNodePath.length === 0}>Remove</button>
                        </div>
                    </div>
                    <div className="property-tree-area">
                        {renderTree(Array.isArray(propertiesState.propertyTree) ? propertiesState.propertyTree : [])}
                    </div>
                </div>
            )}
            {activeTab === 'os' && (
                <div className="properties-page-flex">
                    <div className="property-input-area property-input-area--fullwidth">
                        <div className="property-row property-row--threecol">
                            <div className="property-group">
                                <label>OS Type</label>
                                <select name="type" value={propertiesState.osType.type} onChange={handleOsTypeChange}>
                                    {OS_NAME_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>Bit</label>
                                <select name="bit" value={propertiesState.osType.bit} onChange={handleOsTypeChange}>
                                    {BIT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>Version</label>
                                <select name="version" value={propertiesState.osType.version} onChange={handleOsTypeChange}>
                                    {osVersionOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'compiler' && (
                <div className="properties-page-flex">
                    <div className="property-input-area">
                        <div className="property-row property-row--twocol">
                            <div className="property-group">
                                <label>OS Name</label>
                                <select name="osName" value={propertiesState.compilerType.osName} onChange={handleCompilerTypeChange}>
                                    {OS_NAME_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>VerRangeOS (min/max)</label>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <select name="verRangeOS_min" value={propertiesState.compilerType.verRangeOS?.min || ''} onChange={e => setPropertiesState(s => ({ ...s, compilerType: { ...s.compilerType, verRangeOS: { ...s.compilerType.verRangeOS, min: e.target.value } } }))} style={{ width: '50%' }}>
                                        {getOSVersionOptions(propertiesState.compilerType.osName).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <select name="verRangeOS_max" value={propertiesState.compilerType.verRangeOS?.max || ''} onChange={e => setPropertiesState(s => ({ ...s, compilerType: { ...s.compilerType, verRangeOS: { ...s.compilerType.verRangeOS, max: e.target.value } } }))} style={{ width: '50%' }}>
                                        {getOSVersionOptions(propertiesState.compilerType.osName).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="property-row property-row--twocol">
                            <div className="property-group">
                                <label>Compiler Name</label>
                                <select name="compilerName" value={propertiesState.compilerType.compilerName} onChange={handleCompilerTypeChange}>
                                    {COMPILER_NAME_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>VerRangeCompiler (min/max)</label>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <select name="verRangeCompiler_min" value={propertiesState.compilerType.verRangeCompiler?.min || ''} onChange={e => setPropertiesState(s => ({ ...s, compilerType: { ...s.compilerType, verRangeCompiler: { ...s.compilerType.verRangeCompiler, min: e.target.value } } }))} style={{ width: '50%' }}>
                                        {getCompilerVersionOptions(propertiesState.compilerType.compilerName).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <select name="verRangeCompiler_max" value={propertiesState.compilerType.verRangeCompiler?.max || ''} onChange={e => setPropertiesState(s => ({ ...s, compilerType: { ...s.compilerType, verRangeCompiler: { ...s.compilerType.verRangeCompiler, max: e.target.value } } }))} style={{ width: '50%' }}>
                                        {getCompilerVersionOptions(propertiesState.compilerType.compilerName).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="property-group">
                            <label>BitsnCPUarch</label>
                            <select name="bitsnCPUarch" value={propertiesState.compilerType.bitsnCPUarch} onChange={handleCompilerTypeChange}>
                                {CPU_ARCH_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="property-group">
                            <label>Execution Types</label>
                        </div>
                        <div className="property-row property-row--compact">
                            <input type="text" name="priorty" placeholder="Priority" value={executionInput.priorty} onChange={handleExecutionInputChange} />
                            <select name="opType" value={executionInput.opType} onChange={handleExecutionInputChange}>
                                <option value="">Select OpType</option>
                                {OP_TYPES_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <input type="text" name="hardRT" placeholder="HardRT" value={executionInput.hardRT} onChange={handleExecutionInputChange} />
                            <input type="text" name="timeConstraint" placeholder="TimeConstraint" value={executionInput.timeConstraint} onChange={handleExecutionInputChange} />
                            <select name="instanceType" value={executionInput.instanceType} onChange={handleExecutionInputChange}>
                                <option value="">Select InstanceType</option>
                                {INSTANCE_TYPES_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <button type="button" className="property-btn" onClick={handleAddExecution} style={{ minWidth: 40, padding: '4px 8px' }}>Add</button>
                        </div>
                        {propertiesState.executionTypes.length > 0 && (
                            <div className="execution-list-viewer">
                                {propertiesState.executionTypes.map((et, idx) => (
                                    <div key={idx} className="property-row property-row--compact execution-list-row">
                                        <span className="execution-list-item">{et.priorty}</span>
                                        <span className="execution-list-item">{et.opType}</span>
                                        <span className="execution-list-item">{et.hardRT}</span>
                                        <span className="execution-list-item">{et.timeConstraint}</span>
                                        <span className="execution-list-item">{et.instanceType}</span>
                                        <button type="button" className="property-btn" onClick={() => handleRemoveExecution(idx)} style={{ minWidth: 40, padding: '4px 8px' }}>Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'libraries' && (
                <div className="properties-page-flex">
                    <div className="property-input-area property-input-area--fullwidth">
                        <div className="property-group">
                            <label>Libraries</label>
                        </div>
                        <div className="property-row property-row--fullwidth">
                            <input type="text" name="name" placeholder="Name" value={libraryInput.name} onChange={handleLibraryInputChange} />
                            <input type="text" name="version" placeholder="Version" value={libraryInput.version} onChange={handleLibraryInputChange} />
                            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', width: '80px' }}>
                                <button type="button" className="property-btn" onClick={handleAddLibrary} style={{ minWidth: 60, width: '100%' }}>Add</button>
                            </div>
                        </div>
                        {propertiesState.libraries.length > 0 && (
                            <div className="library-list-viewer">
                                {propertiesState.libraries.map((lib, idx) => (
                                    <div key={idx} className="property-row property-row--fullwidth library-list-row">
                                        <span className="library-list-item">{lib.name}</span>
                                        <span className="library-list-item">{lib.version}</span>
                                        <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', width: '80px' }}>
                                            <button type="button" className="property-btn" onClick={() => handleRemoveLibrary(idx)} style={{ minWidth: 60, width: '100%' }}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'organization' && (
                <div className="properties-page-flex">
                    <div className="property-input-area property-input-area--fullwidth">
                        <div className="property-row property-row--twocol">
                            <div className="property-group">
                                <label>Owner</label>
                                <input type="text" name="owner" value={propertiesState.organization?.owner || ''} onChange={handleOrganizationChange} placeholder="Enter owner name" />
                            </div>
                            <div className="property-group">
                                <label>Dependency Type</label>
                                <select name="dependency" value={propertiesState.organization?.dependency || ''} onChange={handleOrganizationChange}>
                                    {DEPENDENCY_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="property-row property-row--twocol">
                            <div className="property-group">
                                <label>OrgMember Type - Module ID</label>
                                <input type="text" name="moduleID" value={propertiesState.organization?.orgMemberType?.moduleID || ''} onChange={handleOrgMemberTypeChange} placeholder="Enter Module ID" />
                            </div>
                            <div className="property-group">
                                <label>OrgMember Type - Dependency</label>
                                <select name="dependency" value={propertiesState.organization?.orgMemberType?.dependency || ''} onChange={handleOrgMemberTypeChange}>
                                    {DEPENDENCY_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="property-group">
                            <label>Additional Info</label>
                        </div>
                        <div className="property-row property-row--fullwidth">
                            <input type="text" name="name" placeholder="Name" value={additionalInfoInput.name} onChange={handleAdditionalInfoInputChange} />
                            <input type="text" name="value" placeholder="Value" value={additionalInfoInput.value} onChange={handleAdditionalInfoInputChange} />
                            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', width: '80px' }}>
                                <button type="button" className="property-btn" onClick={handleAddAdditionalInfo} style={{ minWidth: 60, width: '100%' }}>Add</button>
                            </div>
                        </div>
                        {propertiesState.organization?.additionalInfo?.length > 0 && (
                            <div className="orginfo-list-viewer">
                                {propertiesState.organization.additionalInfo.map((info, idx) => (
                                    <div key={idx} className="property-row property-row--fullwidth orginfo-list-row">
                                        <span className="orginfo-list-item">{info.name}</span>
                                        <span className="orginfo-list-item">{info.value}</span>
                                        <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end', width: '80px' }}>
                                            <button type="button" className="property-btn" onClick={() => handleRemoveAdditionalInfo(idx)} style={{ minWidth: 60, width: '100%' }}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* 다른 탭 영역은 추후 구현 */}
        </div>
    );
}

export default PropertiesPage; 