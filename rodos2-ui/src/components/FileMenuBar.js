import React from 'react';

function FileMenuBar({ onNewSIM }) {
    return (
        <div className="file-menu-bar">
            <button className="file-menu-btn" onClick={onNewSIM}>New SIM</button>
        </div>
    );
}

export default FileMenuBar;