import React, { useState, useEffect, useRef } from 'react';
import '../styles/IOVariablesPage.css';
import { COMPLEX_TYPE_OPTIONS, TYPE_OPTIONS, UNIT_OPTIONS } from '../utils/Options';
import { TreeNode } from '../utils/TreeNode';
import { addNodeAtPath, removeNodeAtPath, createTreeNode, getNodeAtPath, getParentPath } from '../utils/TreeUtils';
import { getNodeLabel, getNodeTooltip, isComplexType } from '../utils/TreeNodeLabelUtils';

// 초기 트리 구조 생성
const createInitialTree = () => [
    createTreeNode({ name: 'inputs', direction: 'input', isRoot: true }),
    createTreeNode({ name: 'outputs', direction: 'output', isRoot: true }),
    createTreeNode({ name: 'inouts', direction: 'inout', isRoot: true }),
];

// ioVariables <-> tree 변환 유틸리티 (TreeNode 사용)
function ioVariablesToTree(ioVariables) {
    if (!ioVariables) return createInitialTree();

    const convertIOVariableToNode = (ioVar) => {
        const nodeData = {
            name: ioVar.name || '',
            type: ioVar.type || '',
            unit: ioVar.unit || '',
            value: ioVar.value || '',
            description: ioVar.description || '',
            complexType: ioVar.complexType || 'NONE',
            complexName: ioVar.complexName || '',
            inDataType: ioVar.inDataType || '',
            direction: ioVar.direction || ''
        };

        const children = [];

        // 중첩된 요소들이 있는 경우 처리
        if (ioVar.nestedInputs && ioVar.nestedInputs.length > 0) {
            children.push(...ioVar.nestedInputs.map(convertIOVariableToNode));
        } else if (ioVar.nestedOutputs && ioVar.nestedOutputs.length > 0) {
            children.push(...ioVar.nestedOutputs.map(convertIOVariableToNode));
        } else if (ioVar.nestedInOuts && ioVar.nestedInOuts.length > 0) {
            children.push(...ioVar.nestedInOuts.map(convertIOVariableToNode));
        }

        return createTreeNode(nodeData, children);
    };

    // Backend expects inputs, outputs, inouts (uppercase)
    const inputs = (ioVariables.inputs || []).map(convertIOVariableToNode);
    const outputs = (ioVariables.outputs || []).map(convertIOVariableToNode);
    const inouts = (ioVariables.inouts || []).map(convertIOVariableToNode);

    return [
        createTreeNode({ name: 'inputs', direction: 'input', isRoot: true }, inputs),
        createTreeNode({ name: 'outputs', direction: 'output', isRoot: true }, outputs),
        createTreeNode({ name: 'inouts', direction: 'inout', isRoot: true }, inouts),
    ];
}

function treeToIoVariables(tree) {
    const convertNodeToIOVariable = (node) => {
        const nodeData = node.getValue();
        const result = {
            name: nodeData.name || '',
            type: nodeData.type || '',
            unit: nodeData.unit || '',
            value: nodeData.value || '',
            description: nodeData.description || '',
            complexType: nodeData.complexType || 'NONE',
            complexName: nodeData.complexName || '',
            inDataType: nodeData.inDataType || '',
            direction: nodeData.direction || ''
        };

        // 중첩된 요소들이 있는 경우 처리
        if (node.hasChildren && node.hasChildren()) {
            const children = node.children;
            if (nodeData.direction === 'input') {
                result.nestedInputs = children.map(convertNodeToIOVariable);
            } else if (nodeData.direction === 'output') {
                result.nestedOutputs = children.map(convertNodeToIOVariable);
            } else if (nodeData.direction === 'inout') {
                result.nestedInOuts = children.map(convertNodeToIOVariable);
            }
        }

        return result;
    };

    return {
        // Use uppercase field names to match backend expectations
        inputs: tree[0]?.children?.map(convertNodeToIOVariable) || [],
        outputs: tree[1]?.children?.map(convertNodeToIOVariable) || [],
        inouts: tree[2]?.children?.map(convertNodeToIOVariable) || [],
    };
}

function IOVariablesPage({ ioVariables = {}, setIoVariables }) {
    const [ioVariablesState, setIoVariablesState] = useState(ioVariables);
    const [tree, setTree] = useState(ioVariablesToTree(ioVariables));
    const [selectedNodePath, setSelectedNodePath] = useState([]);
    const [typeInput, setTypeInput] = useState('');
    const [unitInput, setUnitInput] = useState('');
    const [expanded, setExpanded] = useState({ '0': true, '1': true, '2': true });
    const [ioVar, setIoVar] = useState({
        complexType: '',
        name: '',
        type: '',
        unit: '',
        value: '',
        description: '',
    });
    const isInitialized = useRef(false);

    // props로 받은 ioVariables가 바뀔 때만 동기화 (초기 로드 시에만)
    useEffect(() => {
        if (!isInitialized.current) {
            // Only use uppercase field names to match backend expectations
            const mergedIoVariables = {
                inputs: ioVariables.inputs || [],
                outputs: ioVariables.outputs || [],
                inouts: ioVariables.inouts || []
            };
            setIoVariablesState(mergedIoVariables);
            setTree(ioVariablesToTree(mergedIoVariables));
            isInitialized.current = true;
        }
    }, [ioVariables]);

    // 트리 상태가 변경될 때마다 부모 컴포넌트에 동기화
    useEffect(() => {
        if (isInitialized.current) {
            const convertedData = treeToIoVariables(tree);
            setIoVariables(convertedData);
        }
    }, [tree, setIoVariables]);

    // 입력값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIoVar(prev => ({ ...prev, [name]: value }));
    };

    // 트리에서 노드 선택
    const handleSelectNode = (path) => {
        setSelectedNodePath(path);
        const selectedNode = getNodeAtPath(tree, path);
        if (selectedNode && !selectedNode.getValue().isRoot) {
            const nodeData = selectedNode.getValue();
            setIoVar({
                complexType: nodeData.complexType || '',
                name: nodeData.name || '',
                type: nodeData.type || '',
                unit: nodeData.unit || '',
                value: nodeData.value || '',
                description: nodeData.description || '',
                complexName: nodeData.complexName || '',
                inDataType: nodeData.inDataType || '',
            });
        } else {
            // 루트(inputs/outputs/inouts) 선택 시 입력폼 초기화
            setIoVar({
                complexType: '', name: '', type: '', unit: '', value: '', description: '', complexName: '', inDataType: ''
            });
        }
    };

    // 트리 토글
    const toggleExpand = (pathStr) => {
        setExpanded(prev => ({ ...prev, [pathStr]: !prev[pathStr] }));
    };

    // 추가 버튼
    const handleAdd = () => {
        if (selectedNodePath.length === 0) return;

        const selectedNode = getNodeAtPath(tree, selectedNodePath);
        const nodeData = selectedNode.getValue();
        const isComplexType = nodeData.complexType && nodeData.complexType !== 'NONE';

        let targetPath;
        let direction;

        if (selectedNodePath.length === 1) {
            // 루트(inputs/outputs/inouts) 선택 시
            targetPath = selectedNodePath;
            direction = ['input', 'output', 'inout'][selectedNodePath[0]];
        } else if (isComplexType) {
            // 복잡한 타입의 노드 선택 시 - 자식으로 추가
            targetPath = selectedNodePath;
            direction = nodeData.direction;
        } else {
            // 일반 노드 선택 시 - 같은 레벨에 추가
            targetPath = getParentPath(selectedNodePath);
            direction = ['input', 'output', 'inout'][targetPath[0]];
        }

        const newNode = createTreeNode({
            ...ioVar,
            direction,
        });

        setTree(prev => addNodeAtPath(prev, targetPath, newNode));
        setIoVar({ complexType: '', name: '', type: '', unit: '', value: '', description: '', complexName: '', inDataType: '' });
        setTypeInput('');
        setUnitInput('');

        // 새로 추가된 노드의 경로 계산하여 선택
        const parentNode = getNodeAtPath(tree, targetPath);
        const newPath = [...targetPath, parentNode.getChildCount()];
        setSelectedNodePath(newPath);
        setExpanded(prev => ({ ...prev, [targetPath.join('-')]: true }));
    };

    // 삭제 버튼
    const handleRemove = () => {
        if (selectedNodePath.length <= 1) return;
        setTree(prev => removeNodeAtPath(prev, selectedNodePath));
        // 부모 노드로 선택 이동
        const parentPath = getParentPath(selectedNodePath);
        setSelectedNodePath(parentPath);
        setIoVar({ complexType: '', name: '', type: '', unit: '', value: '', description: '', complexName: '', inDataType: '' });
    };

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

    // 트리뷰 재귀 렌더링 (개선된 라벨링 적용)
    const renderTree = (nodes, path = []) => (
        <ul className="io-tree">
            {nodes.map((node, idx) => {
                const currentPath = [...path, idx];
                const pathStr = currentPath.join('-');
                const hasChildren = node.hasChildren && node.hasChildren();
                const isOpen = expanded[pathStr];
                const isSelected = JSON.stringify(currentPath) === JSON.stringify(selectedNodePath);
                const nodeLabel = getNodeLabel(node);
                const nodeTooltip = getNodeTooltip(node);
                const nodeData = node instanceof TreeNode ? node.getValue() : node;
                const isRoot = nodeData.isRoot;
                const dataType = isRoot ? 'io-root' : (nodeData.complexType || 'io-simple').toLowerCase();

                return (
                    <li key={pathStr}>
                        <div
                            className={`io-tree-node${isSelected ? ' selected' : ''}`}
                            onClick={() => handleSelectNode(currentPath)}
                            title={nodeTooltip}
                            data-type={dataType}
                        >
                            {hasChildren && (
                                <span className="io-tree-toggle" onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(pathStr);
                                }}>
                                    {isOpen ? '▼' : '▶'}
                                </span>
                            )}
                            <span className="io-tree-label">
                                {isRoot ? nodeData.name : nodeLabel}
                            </span>
                        </div>
                        {hasChildren && isOpen && renderTree(node.children, currentPath)}
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
                    <div className="io-group" style={{ display: 'none' }} />
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
                <div className="io-tree-area">
                    {renderTree(tree)}
                </div>
            </div>
        </div>
    );
}

export default IOVariablesPage; 