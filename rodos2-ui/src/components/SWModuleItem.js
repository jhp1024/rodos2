import React from 'react';

function SWModuleItem({ name }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('type', 'sw');
        e.dataTransfer.setData('name', name);
    };
    return (
        <div draggable onDragStart={handleDragStart} style={{ cursor: 'grab', color: '#bfa32a', fontWeight: 600 }}>
            {name}
        </div>
    );
}
export default SWModuleItem; 