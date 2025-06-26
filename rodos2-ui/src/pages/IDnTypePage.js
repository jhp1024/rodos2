import React, { useEffect } from 'react';
import '../styles/IDnTypePage.css';

function IDnTypePage({ idnType, onChange, genInfo, moduleID }) {
    const initIdnType = idnType || {};
    const initGenInfo = genInfo || {};

    // genInfo.idType이 변경될 때 idnType.IDtype도 자동으로 업데이트
    useEffect(() => {
        if (initGenInfo.idType && initGenInfo.idType !== initIdnType.IDtype) {
            if (onChange) {
                onChange({
                    ...(initIdnType || {}),
                    IDtype: initGenInfo.idType
                });
            }
        }
    }, [initGenInfo.idType, initIdnType, onChange]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`IDnTypePage - handleInputChange: ${name} = ${value}`);
        if (onChange) {
            const newData = { ...(initIdnType || {}), [name]: value, moduleID };
            console.log(`IDnTypePage - calling onChange with:`, newData);
            onChange(newData);
        }
    };

    return (
        <div className="idntype-page">
            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="moduleName">Module Name</label>
                        <input
                            id="moduleName"
                            type="text"
                            value={initGenInfo.moduleName || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="idType">ID Type</label>
                        <input
                            id="idType"
                            type="text"
                            value={initIdnType.IDtype || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="moduleId">Module ID</label>
                        <input
                            id="moduleId"
                            type="text"
                            value={moduleID || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="manufacturer">Manufacturer</label>
                        <input
                            id="manufacturer"
                            type="text"
                            value={initGenInfo.manufacturer || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group full-width">
                        <label htmlFor="infoModelVersion">InfoModelVersion</label>
                        <input
                            id="infoModelVersion"
                            name="infoModelVersion"
                            type="text"
                            value={initIdnType.infoModelVersion || '1.0'}
                            onChange={handleInputChange}
                            placeholder="Enter info model version"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default IDnTypePage;