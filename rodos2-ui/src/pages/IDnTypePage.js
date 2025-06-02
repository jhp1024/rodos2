import React from 'react';

function IDnTypePage({ idnType, onChange }) {
    return (
        <div>
            <h3>ID 및 타입 입력</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label>
                    Type
                    <input
                        type="text"
                        value={idnType.type}
                        onChange={e => onChange({ ...idnType, type: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4 }}
                    />
                </label>
                <label>
                    ID
                    <input
                        type="text"
                        value={idnType.ID}
                        onChange={e => onChange({ ...idnType, ID: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4 }}
                    />
                </label>
                <label>
                    informationModelVersion
                    <input
                        type="text"
                        value={idnType.informationModelVersion}
                        onChange={e => onChange({ ...idnType, informationModelVersion: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4 }}
                    />
                </label>
            </div>
        </div>
    );
}

export default IDnTypePage;