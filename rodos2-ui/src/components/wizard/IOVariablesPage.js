import React from 'react';
import '../../styles/wizard/IOVariablesPage.css';
import { COMPLEX_TYPE_OPTIONS, TYPE_OPTIONS, UNIT_OPTIONS } from '../../utils/Options';
import { TreeNode } from '../../utils/tree/TreeNode';
import { getNodeLabel, getNodeTooltip } from '../../utils/tree/TreeNodeLabelUtils';
import { useIOVariablesState } from '../../hooks/useIOVariablesState';

function IOVariablesPage({ ioVariables = {}, setIoVariables }) {
    const {
        tree,
        selectedNodePath,
        typeInput,
        unitInput,
        expandedNodes,
        ioVar,
        setTypeInput,
        setUnitInput,
        setIoVar,
        handleInputChange,
        handleSelectNode,
        toggleNodeExpansion,
        isNodeExpanded,
        handleAdd,
        handleRemove
    } = useIOVariablesState(ioVariables, setIoVariables);

    // ComplexType에 따른 입력 폼 렌더링
    const renderIoVarForm = () => {
        if (ioVar.complexType === '' || ioVar.complexType === 'NONE') {
            return (
                <>
                    <div className="io-group">
                        <label>Name</label>
                        <input type="text" name="name" value={ioVar.name} onChange={handleInputChange} placeholder="Enter variable name" />
                    </div>
                    <div className="io-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={ioVar.type}
                            onChange={e => {
                                handleInputChange(e);
                                setTypeInput('');
                            }}
                        >
                            {TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {ioVar.type === 'custom' && (
                            <input
                                type="text"
                                name="type"
                                placeholder="직접입력"
                                value={typeInput}
                                onChange={e => {
                                    setTypeInput(e.target.value);
                                    setIoVar(prev => ({ ...prev, type: e.target.value }));
                                }}
                            />
                        )}
                    </div>
                    <div className="io-group">
                        <label>Unit</label>
                        <select
                            name="unit"
                            value={ioVar.unit}
                            onChange={e => {
                                handleInputChange(e);
                                setUnitInput('');
                            }}
                        >
                            {UNIT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {ioVar.unit === 'custom' && (
                            <input
                                type="text"
                                name="unit"
                                placeholder="직접입력"
                                value={unitInput}
                                onChange={e => {
                                    setUnitInput(e.target.value);
                                    setIoVar(prev => ({ ...prev, unit: e.target.value }));
                                }}
                            />
                        )}
                    </div>
                    <div className="io-group">
                        <label>Value</label>
                        <input type="text" name="value" value={ioVar.value} onChange={handleInputChange} placeholder="Enter value" />
                    </div>
                </>
            );
        } else if (ioVar.complexType === 'ARRAY') {
            return (
                <>
                    <div className="io-group">
                        <label>Name</label>
                        <input type="text" name="name" value={ioVar.name} onChange={handleInputChange} placeholder="Enter array name" />
                    </div>
                    <div className="io-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={ioVar.type}
                            onChange={e => {
                                handleInputChange(e);
                                setTypeInput('');
                            }}
                        >
                            <option value="">Select Type</option>
                            {TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {ioVar.type === 'custom' && (
                            <input
                                type="text"
                                name="type"
                                placeholder="직접입력"
                                value={typeInput}
                                onChange={e => {
                                    setTypeInput(e.target.value);
                                    setIoVar(prev => ({ ...prev, type: e.target.value }));
                                }}
                            />
                        )}
                    </div>
                    <div className="io-group">
                        <label>Unit</label>
                        <select
                            name="unit"
                            value={ioVar.unit}
                            onChange={e => {
                                handleInputChange(e);
                                setUnitInput('');
                            }}
                        >
                            <option value="">Select Unit</option>
                            {UNIT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {ioVar.unit === 'custom' && (
                            <input
                                type="text"
                                name="unit"
                                placeholder="직접입력"
                                value={unitInput}
                                onChange={e => {
                                    setUnitInput(e.target.value);
                                    setIoVar(prev => ({ ...prev, unit: e.target.value }));
                                }}
                            />
                        )}
                    </div>
                    <div className="io-group">
                        <label>Value (Array)</label>
                        <textarea name="value" value={ioVar.value} onChange={handleInputChange} placeholder="예: [1,2,3] 또는 [[1,2],[3,4]]" />
                    </div>
                </>
            );
        } else if (ioVar.complexType === 'CLASS') {
            return (
                <>
                    <div className="io-group">
                        <label>Complex Name</label>
                        <input type="text" name="complexName" value={ioVar.complexName || ''} onChange={handleInputChange} placeholder="Enter complex class name" />
                    </div>
                    <div className="io-group">
                        <label>Name</label>
                        <input type="text" name="name" value={ioVar.name} onChange={handleInputChange} placeholder="Enter variable name" />
                    </div>
                    <div className="io-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={ioVar.type}
                            onChange={e => {
                                handleInputChange(e);
                                setTypeInput('');
                            }}
                        >
                            <option value="">Select Type</option>
                            {TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {ioVar.type === 'custom' && (
                            <input
                                type="text"
                                name="type"
                                placeholder="직접입력"
                                value={typeInput}
                                onChange={e => {
                                    setTypeInput(e.target.value);
                                    setIoVar(prev => ({ ...prev, type: e.target.value }));
                                }}
                            />
                        )}
                    </div>
                    <div className="io-group">
                        <label>Unit</label>
                        <select
                            name="unit"
                            value={ioVar.unit}
                            onChange={e => {
                                handleInputChange(e);
                                setUnitInput('');
                            }}
                        >
                            <option value="">Select Unit</option>
                            {UNIT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {ioVar.unit === 'custom' && (
                            <input
                                type="text"
                                name="unit"
                                placeholder="직접입력"
                                value={unitInput}
                                onChange={e => {
                                    setUnitInput(e.target.value);
                                    setIoVar(prev => ({ ...prev, unit: e.target.value }));
                                }}
                            />
                        )}
                    </div>
                    <div className="io-group">
                        <label>Value</label>
                        <input type="text" name="value" value={ioVar.value} onChange={handleInputChange} placeholder="Enter value" />
                    </div>
                </>
            );
        } else if (ioVar.complexType === 'POINTER') {
            return (
                <>
                    <div className="io-group">
                        <label>Name</label>
                        <input type="text" name="name" value={ioVar.name} onChange={handleInputChange} placeholder="Enter pointer name" />
                    </div>
                    <div className="io-group">
                        <label>In Data Type</label>
                        <select name="inDataType" value={ioVar.inDataType || ''} onChange={handleInputChange}>
                            <option value="">Select Data Type</option>
                            {TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </>
            );
        }
        return null;
    };

    // 트리뷰 재귀 렌더링 (PropertiesPage와 동일한 UI)
    const renderTree = (nodes, path = []) => (
        <ul className="io-tree">
            {nodes.map((node, idx) => {
                const currentPath = [...path, idx];
                const hasChildren = node.hasChildren && node.hasChildren();
                const isExpanded = isNodeExpanded(currentPath);
                const isSelected = JSON.stringify(currentPath) === JSON.stringify(selectedNodePath);
                const nodeLabel = getNodeLabel(node);
                const nodeTooltip = getNodeTooltip(node);
                const nodeData = node instanceof TreeNode ? node.getValue() : node;
                const isRoot = nodeData.isRoot;

                return (
                    <li key={JSON.stringify(currentPath)}>
                        <div
                            className={`io-tree-node${isSelected ? ' selected' : ''}${hasChildren ? ' has-children' : ''}${isExpanded ? ' expanded' : ''}${isRoot ? ' root-node' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectNode(currentPath);
                            }}
                            title={nodeTooltip}
                        >
                            {hasChildren && (
                                <span
                                    className="io-tree-expand-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleNodeExpansion(currentPath);
                                    }}
                                />
                            )}
                            {isRoot ? (
                                <span className="root-label">
                                    {nodeData.name}
                                </span>
                            ) : (
                                <span className="io-tree-node-label">{nodeLabel}</span>
                            )}
                        </div>
                        {hasChildren && isExpanded && renderTree(node.children, currentPath)}
                    </li>
                );
            })}
        </ul>
    );

    // 현재 선택된 루트 표시
    const selectedRootLabel = selectedNodePath.length > 0 ? ['inputs', 'outputs', 'inouts'][selectedNodePath[0]] : 'inputs';

    return (
        <div className="io-page">
            <div className="io-flex">
                <div className="io-input-area">
                    <div className="io-group">
                        <label>Complex Type</label>
                        <select name="complexType" value={ioVar.complexType} onChange={handleInputChange}>
                            {COMPLEX_TYPE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    {renderIoVarForm()}
                    <div className="io-group">
                        <label>Description</label>
                        <textarea name="description" value={ioVar.description} onChange={handleInputChange} placeholder="Enter description" />
                    </div>
                    <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                        <button type="button" className="io-btn" onClick={handleAdd} disabled={selectedNodePath.length === 0}>Add</button>
                        <button type="button" className="io-btn" onClick={handleRemove} disabled={selectedNodePath.length <= 1}>Remove</button>
                    </div>
                </div>
                <div className="io-tree-area" onClick={(e) => {
                    // 트리 노드가 아닌 영역 클릭 시에만 선택 해제
                    if (!e.target.closest('.io-tree-node')) {
                        handleSelectNode([]);
                    }
                }}>
                    {renderTree(tree)}
                </div>
            </div>
        </div>
    );
}

export default IOVariablesPage; 