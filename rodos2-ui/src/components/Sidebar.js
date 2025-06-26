import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { MdRefresh } from 'react-icons/md';
import '../styles/Sidebar.css';
import HWModuleItem from './HWModuleItem';
import SWModuleItem from './SWModuleItem';
import WorkSpaceTree from './WorkSpaceTree';

function TreeNode({ node, expanded, onToggle, selectedKey, onSelect, onFileSelect, parentKey }) {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedKey === node.key;
    // 아이콘 없이
    return (
        <div className="tree-node">
            <div
                className={`tree-label${expanded[node.key] ? ' expanded' : ''}${isSelected ? ' selected' : ''}`}
                onClick={e => {
                    e.stopPropagation();
                    if (hasChildren) onToggle(node.key);
                    else onFileSelect(node);
                    onSelect(node.key);
                }}
            >
                {hasChildren && (
                    <span className="tree-arrow">{expanded[node.key] ? '▼' : '▶'}</span>
                )}
                <span className="tree-label-text">{typeof node.label === 'string' ? node.label : node.label}</span>
            </div>
            {hasChildren && expanded[node.key] && (
                <div className="tree-children">
                    {node.children.map(child => (
                        <TreeNode
                            key={child.key}
                            node={child}
                            expanded={expanded}
                            onToggle={onToggle}
                            selectedKey={selectedKey}
                            onSelect={onSelect}
                            onFileSelect={onFileSelect}
                            parentKey={node.key}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const Sidebar = forwardRef((props, ref) => {
    const [expanded, setExpanded] = useState({ workspace: true });
    const [selectedKey, setSelectedKey] = useState(null);
    const [workspaceTree, setWorkspaceTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contextMenu, setContextMenu] = useState(null); // {x, y, node}

    // .rodos/WorkSpace 디렉토리 구조를 가져오는 함수
    const fetchWorkspaceStructure = async () => {
        try {
            setLoading(true);
            const response = await fetch('/app/api/workspace/structure');
            if (response.ok) {
                const data = await response.json();
                setWorkspaceTree(data);
            } else {
                console.error('Failed to fetch workspace structure');
                // 기본 구조로 폴백
                setWorkspaceTree([
                    {
                        key: 'workspace',
                        label: 'WorkSpace',
                        children: [
                            {
                                key: 'configuration',
                                label: 'Configuration',
                                children: []
                            },
                            {
                                key: 'moduleinfo',
                                label: 'Module Info',
                                children: []
                            }
                        ]
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching workspace structure:', error);
            // 에러 시 기본 구조로 폴백
            setWorkspaceTree([
                {
                    key: 'workspace',
                    label: 'WorkSpace',
                    children: [
                        {
                            key: 'configuration',
                            label: 'Configuration',
                            children: []
                        },
                        {
                            key: 'moduleinfo',
                            label: 'Module Info',
                            children: []
                        }
                    ]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 부모 컴포넌트에서 호출할 수 있도록 함수 노출
    useImperativeHandle(ref, () => ({
        refreshWorkspace: fetchWorkspaceStructure
    }));

    // 컴포넌트 마운트 시 워크스페이스 구조 가져오기
    useEffect(() => {
        fetchWorkspaceStructure();
    }, []);

    const handleToggle = key => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelect = key => {
        setSelectedKey(key);
    };

    const handleFileSelect = (fileNode) => {
        console.log('File selected:', fileNode);
        // 파일 선택 시 처리 (예: 파일 내용 로드, 편집기에서 열기 등)
        // TODO: 파일 내용을 가져와서 편집기에서 표시하는 로직 추가
    };

    // staticNodes에서 children에 컴포넌트로 렌더링, 아이콘 추가
    const staticNodes = [
        { key: 'ai', label: 'AI Module', children: [] },
        {
            key: 'robot', label: 'Robot Module', children: [
                { key: 'laseravoidance', label: <SWModuleItem name="LaserAvoidanceNode" />, children: [] }
            ]
        },
        { key: 'cloud', label: 'Cloud', children: [] },
        { key: 'edge', label: 'Edge', children: [] },
        {
            key: 'robot2', label: 'Robot', children: [
                { key: 'turtlebot3', label: <HWModuleItem name="Turtlebot3" />, children: [] }
            ]
        }
    ];

    if (loading) {
        return (
            <div className="sidebar">
                <div className="sidebar-header">
                    <button className="sidebar-refresh-btn" onClick={fetchWorkspaceStructure}>
                        <MdRefresh size={20} style={{ marginRight: 4 }} /> Refresh
                    </button>
                </div>
                <div className="sidebar-loading">Loading workspace...</div>
            </div>
        );
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="sidebar-refresh-btn" onClick={fetchWorkspaceStructure}>
                    <MdRefresh size={20} style={{ marginRight: 4 }} /> Refresh
                </button>
            </div>
            <div className="sidebar-tree">
                {/* WorkSpace만 별도 컴포넌트로 */}
                <WorkSpaceTree
                    workspaceTree={workspaceTree}
                    expanded={expanded}
                    selectedKey={selectedKey}
                    onToggle={handleToggle}
                    onSelect={handleSelect}
                    onFileSelect={handleFileSelect}
                />
                {/* 나머지 노드는 하드코딩, 하위 아이템은 드래그앤드롭 가능 */}
                {staticNodes.map(node => (
                    <TreeNode
                        key={node.key}
                        node={node}
                        expanded={expanded}
                        onToggle={handleToggle}
                        selectedKey={selectedKey}
                        onSelect={handleSelect}
                        onFileSelect={handleFileSelect}
                    />
                ))}
            </div>
        </div>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;