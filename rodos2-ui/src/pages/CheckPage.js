import React, { useState, useEffect } from 'react';

function CheckPage({ genInfo, idnType, properties, ioVariables, services, infrastructure, safeSecure, executableForm }) {
    const [xml, setXml] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 백엔드에서 XML 가져오기
    useEffect(() => {
        fetchXMLFromBackend();
    }, [genInfo, idnType, properties, ioVariables, services, infrastructure, safeSecure, executableForm]);

    const fetchXMLFromBackend = async () => {
        try {
            setLoading(true);
            setError(null);

            // 모든 입력 데이터를 하나의 객체로 구성
            const moduleData = {
                genInfo: genInfo || {},
                idnType: idnType || {},
                properties: properties || {},
                ioVariables: ioVariables || {},
                services: services || {},
                infrastructure: infrastructure || {},
                safeSecure: safeSecure || {},
                executableForm: executableForm || {}
            };

            const response = await fetch('/app/api/module/preview-xml', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moduleData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const xmlData = await response.text();
            setXml(xmlData);
        } catch (error) {
            console.error('Error fetching XML:', error);
            setError('Failed to load XML from backend');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="check-page">
                <h2>XML Preview</h2>
                <div className="xml-preview-desc">Loading XML from backend...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="check-page">
                <h2>XML Preview</h2>
                <div className="xml-preview-desc">Error: {error}</div>
                <button onClick={fetchXMLFromBackend} className="save-xml-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="check-page">
            <h2>XML Preview</h2>
            <div className="xml-preview-area">
                <pre>{xml}</pre>
            </div>
        </div>
    );
}

export default CheckPage; 