import React from 'react';

const tabs = ['File', 'Edit', 'View', 'Launch'];

function TopTabs({ selectedTab, onTabChange }) {
    return (
        <div className="top-tabs">
            {tabs.map(tab => (
                <div
                    key={tab}
                    className={`top-tab${selectedTab === tab ? ' active' : ''}`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
}

export default TopTabs;