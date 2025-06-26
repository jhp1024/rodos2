import React, { useState } from 'react';

function WorkSpaceTree({ workspaceTree, expanded, selectedKey, onToggle, onSelect, onFileSelect, onContextMenu }) {
    // context menu 상태
    const [contextMenu, setContextMenu] = useState(null); // {x, y, node, parentKey}

    // context menu 핸들러
    const handleContextMenu = (e, node, parentKey) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node, parentKey });
        if (onContextMenu) onContextMenu(e, node, parentKey);
    };
    const handleCloseContextMenu = () => setContextMenu(null);

    // 메뉴 동작
    const handleMenuClick = (action) => {
        if (action === 'open' && contextMenu) {
            // Module Info 하위 XML 파일이면 새 탭에서 열기
            if (contextMenu.parentKey === 'moduleinfo' && contextMenu.node.label.endsWith('.xml')) {
                window.open('/module-info/' + encodeURIComponent(contextMenu.node.label), '_blank');
            } else {
                alert('Open: ' + contextMenu.node.label);
            }
        } else if (action === 'edit') {
            alert('Edit: ' + contextMenu.node.label);
        } else if (action === 'upload') {
            alert('Upload: ' + contextMenu.node.label);
        }
        handleCloseContextMenu();
    };

    // 재귀적으로 트리 렌더링
    const renderTree = (node, parentKey) => {
        const hasChildren = node.children && node.children.length > 0;
        const isSelected = selectedKey === node.key;
        return (
            <div className="tree-node" key={node.key}>
                <div
                    className={`tree-label${expanded[node.key] ? ' expanded' : ''}${isSelected ? ' selected' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        if (hasChildren) onToggle(node.key);
                        else onFileSelect(node);
                        onSelect(node.key);
                    }}
                    onContextMenu={e => handleContextMenu(e, node, parentKey)}
                >
                    {hasChildren && (
                        <span className="tree-arrow">{expanded[node.key] ? '▼' : '▶'}</span>
                    )}
                    <span className="tree-label-text">{typeof node.label === 'string' ? node.label : node.label}</span>
                </div>
                {hasChildren && expanded[node.key] && (
                    <div className="tree-children">
                        {node.children.map(child => renderTree(child, node.key))}
                    </div>
                )}
            </div>
        );
    };
    return <>
        {workspaceTree.map(node => renderTree(node, null))}
        {contextMenu && (
            <div
                className="sidebar-context-menu"
                style={{ position: 'fixed', top: contextMenu.x, left: contextMenu.y, zIndex: 9999, background: '#fff', border: '1px solid #ccc', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                onMouseLeave={handleCloseContextMenu}
            >
                <div className="sidebar-context-menu-item" onClick={() => handleMenuClick('open')}>Open</div>
                <div className="sidebar-context-menu-item" onClick={() => handleMenuClick('edit')}>Edit</div>
                <div className="sidebar-context-menu-item" onClick={() => handleMenuClick('upload')}>Upload</div>
            </div>
        )}
    </>;
}

export default WorkSpaceTree; 