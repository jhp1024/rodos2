import React, { useEffect } from 'react';
import { useRegistryModules } from '../../hooks/useRegistryModules';
import { registryService } from '../../services/registryService';
import '../../styles/ide/RegistryModules.css';

function RegistryModules({ expanded, selectedKey, onToggle, onSelect, onContextMenu }) {
    const {
        registryModules,
        loading,
        draggedItem,
        loadRegistryModules,
        handleDragStart,
        handleDragEnd
    } = useRegistryModules();

    // Registry 모듈 데이터 로드
    useEffect(() => {
        loadRegistryModules();
    }, [loadRegistryModules]);

    // 드래그 오버 핸들러
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // 드롭 핸들러
    const handleDrop = (e, targetNode) => {
        e.preventDefault();

        if (!draggedItem || draggedItem.key === targetNode.key) {
            return;
        }

        // 드래그 앤 드롭 로직 구현
        console.log(`드래그된 아이템: ${draggedItem.label} -> ${targetNode.label}`);

        // 여기에 실제 드래그 앤 드롭 로직을 구현할 수 있습니다
        // 예: 모듈 이동, 카테고리 변경 등
    };

    // context menu 핸들러
    const handleContextMenu = (e, node, parentKey) => {
        e.preventDefault();
        if (onContextMenu) onContextMenu(e, node, parentKey);
    };

    // 메뉴 동작
    const handleMenuClick = async (action, node) => {
        try {
            if (action === 'open') {
                if (node.type === 'module') {
                    // Registry 모듈 정보를 새 탭에서 열기
                    window.open(`/api/registry/module/${node.key}`, '_blank');
                } else if (node.type === 'directory') {
                    // 디렉토리 토글
                    onToggle(node.key);
                }
            } else if (action === 'edit') {
                if (node.type === 'module') {
                    // Registry 모듈 편집
                    window.open(`/api/registry/module/${node.key}/edit`, '_blank');
                }
            } else if (action === 'delete') {
                if (node.type === 'module') {
                    // Registry에서 모듈 삭제
                    if (window.confirm(`Are you sure you want to delete "${node.label}" from Registry?`)) {
                        try {
                            await registryService.deleteModule(node.key);
                            alert('Module deleted successfully from Registry: ' + node.label);
                            // 트리 새로고침
                            loadRegistryModules();
                        } catch (error) {
                            console.error('Delete error:', error);
                            alert('Delete failed');
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Menu action error:', error);
            alert('Action failed');
        }
    };

    // 재귀적으로 트리 렌더링
    const renderTree = (node, parentKey) => {
        const hasChildren = node.children && node.children.length > 0;
        const isSelected = selectedKey === node.key;
        const isExpanded = expanded[node.key];
        const isModule = node.type === 'module';

        return (
            <div key={node.key} className="tree-node">
                <div
                    className={`tree-label ${isSelected ? 'selected' : ''}`}
                    data-type={node.type}
                    data-draggable={isModule}
                    data-module-type={node.moduleType}
                    draggable={isModule}
                    onDragStart={isModule ? (e) => handleDragStart(e, node) : undefined}
                    onDragOver={isModule ? (e) => handleDragOver(e) : undefined}
                    onDrop={isModule ? (e) => handleDrop(e, node) : undefined}
                    onClick={e => {
                        e.stopPropagation();
                        if (hasChildren) onToggle(node.key);
                        else onSelect(node.key);
                    }}
                    onDragEnd={isModule ? handleDragEnd : undefined}
                    onContextMenu={e => handleContextMenu(e, node, parentKey)}
                >
                    {hasChildren && (
                        <span className={`tree-arrow ${isExpanded ? 'expanded' : ''}`}>
                            {isExpanded ? '▼' : '▶'}
                        </span>
                    )}
                    {isModule && <div className="drag-handle" title="드래그하여 이동"></div>}
                    <span className="tree-label-text">
                        {node.label}
                    </span>
                </div>
                {hasChildren && isExpanded && (
                    <div className="tree-children">
                        {node.children.map(child => renderTree(child, node.key))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                Loading registry modules...
            </div>
        );
    }

    return (
        <div className="registry-modules">
            <div className="registry-tree">
                {registryModules.map(node => renderTree(node, null))}
            </div>
        </div>
    );
}

export default RegistryModules;
