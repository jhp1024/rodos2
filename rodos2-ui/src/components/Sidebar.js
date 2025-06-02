import React, { useState } from 'react';

const tabs = [
    { key: 'workspace', label: 'WorkSpace' },
    { key: 'ai', label: 'AI Module' },
    { key: 'robot', label: 'Robot Module' },
    { key: 'cloud', label: 'Cloud' },
    { key: 'edge', label: 'Edge' },
    { key: 'robot2', label: 'Robot' }
];

function Sidebar() {
    const [selectedTab, setSelectedTab] = useState('workspace');

    return (
        <div className="sidebar">
            <div className="sidebar-tabs">
                {tabs.map(tab => (
                    <div
                        key={tab.key}
                        className={`sidebar-tab${selectedTab === tab.key ? ' active' : ''}`}
                        onClick={() => setSelectedTab(tab.key)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            {/* 추후: 선택된 탭에 따라 하위 트리뷰어 등 표시 */}
        </div>
    );
}

export default Sidebar;