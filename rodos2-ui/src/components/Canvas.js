import React, { useState, useRef } from 'react';
import Hexagon from './Hexagon';
import Circle from './Circle';
import '../styles/Canvas.css';

function HexagonWithCircles({ label }) {
    return (
        <div className="hexagon-group">
            <div className="hexagon-label">{label}</div>
            <div className="hexagon-canvas">
                <Hexagon size={180} color="#666" />
                <div className="circle-group">
                    <div className="circle-pos top"><Circle size={50} color="#bfa32a" /></div>
                    <div className="circle-pos left"><Circle size={50} color="#bfa32a" /></div>
                    <div className="circle-pos right"><Circle size={50} color="#bfa32a" /></div>
                </div>
            </div>
        </div>
    );
}

function Canvas() {
    const [hwModules, setHwModules] = useState([]); // {name, x, y, swModules: []}
    const [dragOverHexIdx, setDragOverHexIdx] = useState(null);
    const [draggedModuleIdx, setDraggedModuleIdx] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    // 캔버스에 HW 모듈 드롭
    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        const name = e.dataTransfer.getData('name');
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (type === 'hw') {
            setHwModules([...hwModules, { name, x, y, swModules: [] }]);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // 육각형 위에 SW 모듈 드롭
    const handleHexDrop = (e, idx) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        const name = e.dataTransfer.getData('name');
        if (type === 'sw') {
            setHwModules(hwModules => hwModules.map((hw, i) => i === idx ? { ...hw, swModules: [...(hw.swModules || []), { name }] } : hw));
        }
        setDragOverHexIdx(null);
    };
    const handleHexDragOver = (e, idx) => {
        e.preventDefault();
        setDragOverHexIdx(idx);
    };
    const handleHexDragLeave = () => setDragOverHexIdx(null);

    // 모듈 드래그 시작
    const handleModuleMouseDown = (e, idx) => {
        e.preventDefault();
        const rect = canvasRef.current.getBoundingClientRect();
        const module = hwModules[idx];
        setDragOffset({
            x: e.clientX - rect.left - module.x,
            y: e.clientY - rect.top - module.y
        });
        setDraggedModuleIdx(idx);
    };

    // 모듈 드래그 중
    const handleCanvasMouseMove = (e) => {
        if (draggedModuleIdx !== null) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffset.x;
            const newY = e.clientY - rect.top - dragOffset.y;

            setHwModules(prev => prev.map((hw, idx) =>
                idx === draggedModuleIdx ? { ...hw, x: newX, y: newY } : hw
            ));
        }
    };

    // 모듈 드래그 종료
    const handleCanvasMouseUp = () => {
        setDraggedModuleIdx(null);
    };

    return (
        <div
            ref={canvasRef}
            className="hexagon-canvas-container"
            style={{
                width: '100%',
                height: '100%',
                minHeight: 600,
                position: 'relative',
                cursor: draggedModuleIdx !== null ? 'grabbing' : 'default'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
        >
            {hwModules.map((hw, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'absolute',
                        left: hw.x - 120,
                        top: hw.y - 120,
                        zIndex: draggedModuleIdx === idx ? 10 : 2,
                        cursor: 'grab'
                    }}
                    onDrop={e => handleHexDrop(e, idx)}
                    onDragOver={e => handleHexDragOver(e, idx)}
                    onDragLeave={handleHexDragLeave}
                    onMouseDown={e => handleModuleMouseDown(e, idx)}
                >
                    <div style={{ position: 'relative', width: 240, height: 240 }}>
                        <Hexagon size={240} color={dragOverHexIdx === idx ? '#888' : '#666'} />
                        <div style={{
                            position: 'absolute',
                            top: -25,
                            left: 0,
                            width: '100%',
                            textAlign: 'center',
                            color: '#000000',
                            fontWeight: 800,
                            fontSize: 18,
                            textShadow: '1px 1px 3px rgba(255,255,255,0.9)',
                            zIndex: 3
                        }}>
                            {hw.name}
                        </div>
                        {/* SW 모듈(노란 원) 렌더 */}
                        {hw.swModules && hw.swModules.map((sw, swIdx) => (
                            <div key={swIdx} style={{
                                position: 'absolute',
                                left: 85 + swIdx * 60,
                                top: 160,
                                zIndex: 4
                            }}>
                                <Circle size={60} color="#bfa32a" />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '90%',
                                    textAlign: 'center',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: '#333',
                                    lineHeight: '1.2',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {sw.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Canvas; 