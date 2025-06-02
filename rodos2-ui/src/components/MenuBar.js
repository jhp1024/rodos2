import React from 'react';
import {
    MdAdd, MdFolderOpen, MdSave, MdSaveAlt,
    MdUndo, MdRedo, MdLink, MdDelete,
    MdCheckCircle, MdSettings, MdPlayArrow,
    MdStop, MdCloudUpload
} from 'react-icons/md';
import '../styles/MenuBar.css';

function MenuBar() {
    return (
        <div className="toolbar">
            <button><MdAdd /> New</button>
            <button><MdFolderOpen /> Open</button>
            <button><MdSave /> Save</button>
            <button><MdSaveAlt /> Save As</button>
            <div className="toolbar-divider" />
            <button><MdUndo /> Undo</button>
            <button><MdRedo /> Redo</button>
            <div className="toolbar-divider" />
            <button><MdLink /> Link</button>
            <button><MdDelete /> Delete</button>
            <div className="toolbar-divider" />
            <button><MdCheckCircle /> Validation Check</button>
            <button><MdSettings /> Mapping with HW</button>
            <button><MdSettings /> Mapping with Simulation</button>
            <div className="toolbar-divider" />
            <button><MdStop /> Stop</button>
            <button><MdCloudUpload /> Deploy</button>
            <button><MdPlayArrow /> Execute</button>
        </div>
    );
}

export default MenuBar;