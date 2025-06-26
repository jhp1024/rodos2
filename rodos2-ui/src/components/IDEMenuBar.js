import React, { useState, useRef, useEffect } from 'react';
import '../styles/IDEMenuBar.css';

function IDEMenuBar({ onNewSIM }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    // 메뉴 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const handleMenuItemClick = (action) => {
        if (action === 'new-sim') {
            onNewSIM();
        }
        setActiveMenu(null);
    };

    return (
        <div className="ide-menu-bar" ref={menuRef}>
            <div className="menu-item">
                <button
                    className={`menu-button ${activeMenu === 'file' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('file')}
                >
                    File
                </button>
                {activeMenu === 'file' && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item">
                            <span>New IM</span>
                            <div className="submenu">
                                <div
                                    className="submenu-item"
                                    onClick={() => handleMenuItemClick('new-sim')}
                                >
                                    SIM
                                </div>
                                <div
                                    className="submenu-item"
                                    onClick={() => handleMenuItemClick('new-imr')}
                                >
                                    IMR
                                </div>
                                <div
                                    className="submenu-item"
                                    onClick={() => handleMenuItemClick('new-imcon')}
                                >
                                    IMCon
                                </div>
                            </div>
                        </div>
                        <div className="dropdown-divider" />
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('open')}
                        >
                            Open
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('save')}
                        >
                            Save
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('save-as')}
                        >
                            Save As
                        </div>
                        <div className="dropdown-divider" />
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('exit')}
                        >
                            Exit
                        </div>
                    </div>
                )}
            </div>

            <div className="menu-item">
                <button
                    className={`menu-button ${activeMenu === 'edit' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('edit')}
                >
                    Edit
                </button>
                {activeMenu === 'edit' && (
                    <div className="dropdown-menu">
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('undo')}
                        >
                            Undo
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('redo')}
                        >
                            Redo
                        </div>
                        <div className="dropdown-divider" />
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('cut')}
                        >
                            Cut
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('copy')}
                        >
                            Copy
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('paste')}
                        >
                            Paste
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('delete')}
                        >
                            Delete
                        </div>
                    </div>
                )}
            </div>

            <div className="menu-item">
                <button
                    className={`menu-button ${activeMenu === 'view' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('view')}
                >
                    View
                </button>
                {activeMenu === 'view' && (
                    <div className="dropdown-menu">
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('explorer')}
                        >
                            Explorer
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('search')}
                        >
                            Search
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('source-control')}
                        >
                            Source Control
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('run-and-debug')}
                        >
                            Run and Debug
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('extensions')}
                        >
                            Extensions
                        </div>
                    </div>
                )}
            </div>

            <div className="menu-item">
                <button
                    className={`menu-button ${activeMenu === 'launch' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('launch')}
                >
                    Launch
                </button>
                {activeMenu === 'launch' && (
                    <div className="dropdown-menu">
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('start-debugging')}
                        >
                            Start Debugging
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('start-without-debugging')}
                        >
                            Start Without Debugging
                        </div>
                        <div className="dropdown-divider" />
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('stop')}
                        >
                            Stop
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('restart')}
                        >
                            Restart
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IDEMenuBar; 