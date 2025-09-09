import React, { useState, useEffect } from 'react';
import { workspaceService } from '../../services/workspaceService';
import '../../styles/ide/Workspace.css';

function Workspace({ expanded, selectedKey, onToggle, onSelect, onFileSelect, onContextMenu }) {
    const [contextMenu, setContextMenu] = useState(null);
    const [workspaceTree, setWorkspaceTree] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkspaceTree();
    }, []);

    const loadWorkspaceTree = async () => {
        try {
            setLoading(true);
            const structure = await workspaceService.getWorkspaceStructure();

            // 백엔드 응답 구조에 맞게 트리 생성
            const tree = workspaceService.transformStructureToTree(structure);
            setWorkspaceTree(tree);
        } catch (error) {
            console.error('Error loading workspace:', error);
            setWorkspaceTree(workspaceService.getDefaultTree());
        } finally {
            setLoading(false);
        }
    };

    const handleContextMenu = (e, node, parentKey) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node, parentKey });
        if (onContextMenu) onContextMenu(e, node, parentKey);
    };

    const handleCloseContextMenu = () => setContextMenu(null);

    const handleMenuClick = async (action) => {
        if (!contextMenu) return;

        const node = contextMenu.node;
        const isFile = node.type === 'file';
        const isDirectory = node.type === 'directory';

        try {
            if (action === 'open') {
                if (isFile) {
                    if (node.fileType === 'xml') {
                        window.open(`/module-info/${encodeURIComponent(node.label)}`, '_blank');
                    } else {
                        alert('Open: ' + node.label);
                    }
                } else if (isDirectory) {
                    onToggle(node.key);
                }
            } else if (action === 'edit') {
                if (isFile && node.fileType === 'xml') {
                    window.open(`/module-info/edit/${encodeURIComponent(node.label)}`, '_blank');
                } else {
                    alert('Edit: ' + node.label);
                }
            } else if (action === 'upload') {
                if (isDirectory && node.key === 'module-info') {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.xml,.json';
                    input.onchange = async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            try {
                                await workspaceService.uploadFile(file);
                                alert('File uploaded successfully: ' + file.name);
                                loadWorkspaceTree();
                            } catch (error) {
                                console.error('Upload error:', error);
                                alert('Upload failed');
                            }
                        }
                    };
                    input.click();
                }
            } else if (action === 'delete') {
                if (isFile && window.confirm(`Delete "${node.label}"?`)) {
                    try {
                        await workspaceService.deleteFile(node.label);
                        alert('File deleted successfully: ' + node.label);
                        loadWorkspaceTree();
                    } catch (error) {
                        console.error('Delete error:', error);
                        alert('Delete failed');
                    }
                }
            }
        } catch (error) {
            console.error('Menu action error:', error);
            alert('Action failed');
        }

        handleCloseContextMenu();
    };

    const renderTree = (node, parentKey) => {
        const hasChildren = node.children && node.children.length > 0;
        const isSelected = selectedKey === node.key;
        const isExpanded = expanded[node.key];

        return (
            <div key={node.key} className="tree-node">
                <div
                    className={`tree-label ${isSelected ? 'selected' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        if (hasChildren) onToggle(node.key);
                        else onFileSelect(node);
                        onSelect(node.key);
                    }}
                    onContextMenu={e => handleContextMenu(e, node, parentKey)}
                >
                    {hasChildren && (
                        <span className={`tree-arrow ${isExpanded ? 'expanded' : ''}`}>
                            {isExpanded ? '▼' : '▶'}
                        </span>
                    )}
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
                Loading workspace...
            </div>
        );
    }

    return (
        <>
            <div className="workspace">
                <div className="workspace-tree">
                    {workspaceTree.length > 0 ? (
                        workspaceTree.map(node => renderTree(node, null))
                    ) : (
                        <div>No workspace items found</div>
                    )}
                </div>
            </div>
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x
                    }}
                    onMouseLeave={handleCloseContextMenu}
                >
                    <div className="context-menu-item" onClick={() => handleMenuClick('open')}>
                        Open
                    </div>
                    <div className="context-menu-item" onClick={() => handleMenuClick('edit')}>
                        Edit
                    </div>
                    <div className="context-menu-item" onClick={() => handleMenuClick('upload')}>
                        Upload
                    </div>
                    <div className="context-menu-item delete" onClick={() => handleMenuClick('delete')}>
                        Delete
                    </div>
                </div>
            )}
        </>
    );
}

export default Workspace;
