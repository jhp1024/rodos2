import React from 'react';

function GenInfoPage({ genInfo, onChange }) {
    return (
        <div>
            <h3>일반 정보 입력</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label>
                    Module Name
                    <input
                        type="text"
                        value={genInfo.ModuleName}
                        onChange={e => onChange({ ...genInfo, ModuleName: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4 }}
                    />
                </label>
                <label>
                    Manufactures
                    <input
                        type="text"
                        value={genInfo.Manufactures}
                        onChange={e => onChange({ ...genInfo, Manufactures: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4 }}
                    />
                </label>
                <label>
                    Description
                    <textarea
                        value={genInfo.Description}
                        onChange={e => onChange({ ...genInfo, Description: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4, minHeight: 60 }}
                    />
                </label>
                <label>
                    Examples
                    <input
                        type="text"
                        value={genInfo.Examples}
                        onChange={e => onChange({ ...genInfo, Examples: e.target.value })}
                        style={{ width: '100%', padding: 6, marginTop: 4 }}
                    />
                </label>
            </div>
        </div>
    );
}

export default GenInfoPage;