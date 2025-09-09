import React from 'react';
import { usePropertiesState } from '../../hooks/usePropertiesState';
import '../../styles/wizard/PropertiesPage.css';
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
} from '../../utils/Options';
import { getNodeLabel, getNodeTooltip } from '../../utils/tree/TreeNodeLabelUtils';
import { TreeNode } from '../../utils/tree/TreeNode';

function PropertiesPage({ properties = {}, onChange }) {
    const {
        activeTab,
        propertyNodes,
        selectedNodePath,
        property,
        typeInput,
        unitInput,
        executionInput,
        libraryInput,
        additionalInfoInput,
        osVersionOptions,
        osType,
        compilerType,
        executionTypes,
        libraries,
        organization,
        handlePropertyChange,
        handleSelectNode,
        handleAdd,
        handleUpdate,
        handleRemove,
        handleOsTypeChange,
        handleCompilerTypeChange,
        handleAddExecution,
        handleRemoveExecution,
        handleExecutionInputChange,
        handleAddLibrary,
        handleRemoveLibrary,
        handleLibraryInputChange,
        handleOrganizationChange,
        handleOrgMemberTypeChange,
        handleAddAdditionalInfo,
        handleRemoveAdditionalInfo,
        handleAdditionalInfoInputChange,
        handleTabChange,
        toggleNodeExpansion,
        isNodeExpanded,
        handleTreeAreaClick,
        setTypeInput,
        setUnitInput,
        setCompilerType,
        debugTreeStructure
    } = usePropertiesState(properties, onChange);

    // TreeViewer 재귀 렌더링
    const renderTree = (nodes, path = []) => (
        <ul className="property-tree">
            {nodes.map((node, idx) => {
                const currentPath = [...path, idx];
                const isSelected = JSON.stringify(currentPath) === JSON.stringify(selectedNodePath);
                const isExpanded = isNodeExpanded(currentPath);
                const hasChildren = node.hasChildren && node.hasChildren();
                const nodeLabel = getNodeLabel(node);
                const nodeTooltip = getNodeTooltip(node);
                const nodeProperty = node instanceof TreeNode ? node.getValue() : node;
                const complexType = nodeProperty.complexType || nodeProperty.complex || 'NONE';
                const dataType = complexType.toLowerCase();

                return (
                    <li key={idx}>
                        <div
                            className={`property-tree-node${isSelected ? ' selected' : ''}${hasChildren ? ' has-children' : ''}${isExpanded ? ' expanded' : ''}`}
                            title={nodeTooltip}
                            data-type={dataType}
                            onClick={(e) => {
                                e.stopPropagation(); // 항상 이벤트 전파 중단

                                // 확장 아이콘 영역 클릭인지 확인
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;

                                if (hasChildren && clickX <= 20) {
                                    // 확장 아이콘 영역 클릭
                                    toggleNodeExpansion(currentPath);
                                } else {
                                    // 노드 라벨 영역 클릭
                                    handleSelectNode(currentPath);
                                }
                            }}
                        >
                            {nodeLabel}
                        </div>
                        {hasChildren && isExpanded && renderTree(node.children, currentPath)}
                    </li>
                );
            })}
        </ul>
    );

    // Property 입력폼 렌더링 (ComplexType에 따라 다르게)
    const renderPropertyForm = () => {
        if (property.complexType === '' || property.complexType === 'NONE') {
            return <>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Type</label><select name="type" value={property.type} onChange={handlePropertyChange}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.type === 'custom' && (<input type="text" name="typeInput" placeholder="직접입력" value={typeInput} onChange={e => setTypeInput(e.target.value)} />)}</div>
                <div className="property-group"><label>Unit</label><select name="unit" value={property.unit} onChange={handlePropertyChange}>{UNIT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.unit === 'custom' && (<input type="text" name="unitInput" placeholder="직접입력" value={unitInput} onChange={e => setUnitInput(e.target.value)} />)}</div>
                <div className="property-group"><label>Value</label><input name="value" value={property.value} onChange={handlePropertyChange} /></div>
            </>;
        } else if (property.complexType === 'ARRAY') {
            return <>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Type</label><select name="type" value={property.type} onChange={handlePropertyChange}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.type === 'custom' && (<input type="text" name="typeInput" placeholder="직접입력" value={typeInput} onChange={e => setTypeInput(e.target.value)} />)}</div>
                <div className="property-group"><label>Unit</label><select name="unit" value={property.unit} onChange={handlePropertyChange}>{UNIT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.unit === 'custom' && (<input type="text" name="unitInput" placeholder="직접입력" value={unitInput} onChange={e => setUnitInput(e.target.value)} />)}</div>
                <div className="property-group"><label>Value (2D Array)</label><textarea name="value" value={property.value} onChange={handlePropertyChange} placeholder="예: [[1,2],[3,4]]" /></div>
            </>;
        } else if (property.complexType === 'CLASS') {
            return <>
                <div className="property-group"><label>Complex Name</label><input name="complexName" value={property.complexName} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Name</label><input name="name" value={property.name} onChange={handlePropertyChange} /></div>
                <div className="property-group"><label>Type</label><select name="type" value={property.type} onChange={handlePropertyChange}>{TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.type === 'custom' && (<input type="text" name="typeInput" placeholder="직접입력" value={typeInput} onChange={e => setTypeInput(e.target.value)} />)}</div>
                <div className="property-group"><label>Unit</label><select name="unit" value={property.unit} onChange={handlePropertyChange}>{UNIT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>{property.unit === 'custom' && (<input type="text" name="unitInput" placeholder="직접입력" value={unitInput} onChange={e => setUnitInput(e.target.value)} />)}</div>
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
                        onClick={() => handleTabChange(tab.key)}
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
                            {selectedNodePath.length > 0 && (
                                <>
                                    <button type="button" className="property-btn" onClick={handleUpdate}>Update</button>
                                    <button type="button" className="property-btn" onClick={handleRemove}>Remove</button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="property-tree-area" onClick={handleTreeAreaClick}>
                        {renderTree(propertyNodes)}
                    </div>
                </div>
            )}
            {activeTab === 'os' && (
                <div className="properties-page-flex">
                    <div className="property-input-area property-input-area--fullwidth">
                        <div className="property-row property-row--threecol">
                            <div className="property-group">
                                <label>OS Type</label>
                                <select name="type" value={osType.type || ''} onChange={handleOsTypeChange}>
                                    {OS_NAME_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>Bit</label>
                                <select name="bit" value={osType.bit || ''} onChange={handleOsTypeChange}>
                                    {BIT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>Version</label>
                                <select name="version" value={osType.version || ''} onChange={handleOsTypeChange}>
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
                                <select name="osname" value={compilerType.osname || ''} onChange={handleCompilerTypeChange}>
                                    {OS_NAME_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>VerRangeOS (min/max)</label>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <select name="verRangeOS_min" value={compilerType.verRangeOS?.min || ''} onChange={e => setCompilerType(prev => ({ ...prev, verRangeOS: { ...prev.verRangeOS, min: e.target.value } }))} style={{ width: '50%' }}>
                                        {getOSVersionOptions(compilerType.osname).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <select name="verRangeOS_max" value={compilerType.verRangeOS?.max || ''} onChange={e => setCompilerType(prev => ({ ...prev, verRangeOS: { ...prev.verRangeOS, max: e.target.value } }))} style={{ width: '50%' }}>
                                        {getOSVersionOptions(compilerType.osname).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="property-row property-row--twocol">
                            <div className="property-group">
                                <label>Compiler Name</label>
                                <select name="compilerName" value={compilerType.compilerName || ''} onChange={handleCompilerTypeChange}>
                                    {COMPILER_NAME_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="property-group">
                                <label>VerRangeCompiler (min/max)</label>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <select name="verRangeCompiler_min" value={compilerType.verRangeCompiler?.min || ''} onChange={e => setCompilerType(prev => ({ ...prev, verRangeCompiler: { ...prev.verRangeCompiler, min: e.target.value } }))} style={{ width: '50%' }}>
                                        {getCompilerVersionOptions(compilerType.compilerName).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <select name="verRangeCompiler_max" value={compilerType.verRangeCompiler?.max || ''} onChange={e => setCompilerType(prev => ({ ...prev, verRangeCompiler: { ...prev.verRangeCompiler, max: e.target.value } }))} style={{ width: '50%' }}>
                                        {getCompilerVersionOptions(compilerType.compilerName).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="property-group">
                            <label>BitsnCPUarch</label>
                            <select name="bitsnCPUarch" value={compilerType.bitsnCPUarch || ''} onChange={handleCompilerTypeChange}>
                                {CPU_ARCH_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="property-group">
                            <label>Execution Types</label>
                        </div>
                        <div className="property-row property-row--compact">
                            <input type="text" name="priority" placeholder="Priority" value={executionInput.priority} onChange={handleExecutionInputChange} />
                            <select name="opType" value={executionInput.opType} onChange={handleExecutionInputChange}>
                                {OP_TYPES_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <input type="text" name="hardRT" placeholder="HardRT" value={executionInput.hardRT} onChange={handleExecutionInputChange} />
                            <input type="text" name="timeConstraint" placeholder="TimeConstraint" value={executionInput.timeConstraint} onChange={handleExecutionInputChange} />
                            <select name="instanceType" value={executionInput.instanceType} onChange={handleExecutionInputChange}>
                                {INSTANCE_TYPES_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <button type="button" className="property-btn" onClick={handleAddExecution} style={{ minWidth: 40, padding: '4px 8px' }}>Add</button>
                        </div>
                        {executionTypes.length > 0 && (
                            <div className="execution-list-viewer">
                                {executionTypes.map((et, idx) => (
                                    <div key={idx} className="property-row property-row--compact execution-list-row">
                                        <span className="execution-list-item">{et.priority}</span>
                                        <span className="execution-list-item">{et.optype}</span>
                                        <span className="execution-list-item">{et.hardRT}</span>
                                        <span className="execution-list-item">{et.timeConstraint}</span>
                                        <span className="execution-list-item">{et.instanceType}</span>
                                        <button type="button" className="property-btn" onClick={() => handleRemoveExecution(idx)} style={{ minWidth: 40, padding: '8px' }}>Remove</button>
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
                        {libraries.length > 0 && (
                            <div className="library-list-viewer">
                                {libraries.map((lib, idx) => (
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
                                <input type="text" name="owner" value={organization?.owner || ''} onChange={handleOrganizationChange} placeholder="Enter owner name" />
                            </div>
                            <div className="property-group">
                                <label>Dependency Type</label>
                                <select name="dependency" value={organization?.dependency || ''} onChange={handleOrganizationChange}>
                                    {DEPENDENCY_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="property-row property-row--twocol">
                            <div className="property-group">
                                <label>OrgMember Type - Module ID</label>
                                <input type="text" name="moduleID" value={organization?.orgMemberType?.moduleID || ''} onChange={handleOrgMemberTypeChange} placeholder="Enter Module ID" />
                            </div>
                            <div className="property-group">
                                <label>OrgMember Type - Dependency</label>
                                <select name="dependency" value={organization?.orgMemberType?.dependency || ''} onChange={handleOrgMemberTypeChange}>
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
                        {organization?.additionalInfo?.length > 0 && (
                            <div className="orginfo-list-viewer">
                                {organization.additionalInfo.map((info, idx) => (
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