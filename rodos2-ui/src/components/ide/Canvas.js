import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Hexagon, Circle, Rectangle } from '../common';
import { useCanvasState } from '../../hooks/useCanvasState';
import { useCanvasDragAndDrop } from '../../hooks/useCanvasDragAndDrop';
import '../../styles/ide/Canvas.css';

const Canvas = forwardRef(({ onOpenCompositeWizard }, ref) => {
    const {
        hwModules,
        dragOverHexIdx,
        draggedModuleIdx,
        dragOffset,
        draggedSWModule,
        setDragOverHexIdx,
        addHWModule,
        updateHWModulePosition,
        updateHWModuleToComposite,
        addSWModule,
        updateSWModulePosition,
        removeSWModule,
        setDragState,
        setSWDragState,
        clearDragState,
        loadCanvasState,
        newConfiguration
    } = useCanvasState();

    const canvasRef = useRef(null);

    const {
        handleDrop,
        handleHexDrop,
        handleModuleMouseDown,
        handleSWModuleMouseDown,
        handleCanvasMouseMove
    } = useCanvasDragAndDrop(
        canvasRef, hwModules, dragOffset, draggedModuleIdx, draggedSWModule,
        setDragState, setSWDragState, clearDragState,
        addHWModule, addSWModule, removeSWModule,
        updateHWModulePosition, updateSWModulePosition, setDragOverHexIdx,
        onOpenCompositeWizard
    );

    // ref를 통해 외부에서 호출할 수 있는 함수들 노출
    useImperativeHandle(ref, () => ({
        updateHWModuleToComposite
    }), [updateHWModuleToComposite]);

    // IDE 시작 시 초기화 - 새로고침 안전성 개선
    useEffect(() => {
        let isMounted = true;

        const initializeCanvas = async () => {
            try {
                // 컴포넌트가 마운트된 상태에서만 실행
                if (!isMounted) return;

                // 먼저 new-config로 초기화
                await newConfiguration();

                if (isMounted) {
                    console.log('Canvas initialized successfully');
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Failed to initialize canvas:', error);
                    // 초기화 실패 시 기본 상태로 설정
                    try {
                        await loadCanvasState();
                    } catch (loadError) {
                        console.warn('Failed to load canvas state, using empty state:', loadError);
                    }
                }
            }
        };

        // 약간의 지연을 두어 DOM이 완전히 로드된 후 실행
        const timeoutId = setTimeout(initializeCanvas, 100);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [newConfiguration, loadCanvasState]);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleHexDragOver = (e, idx) => {
        e.preventDefault();
        setDragOverHexIdx(idx);
    };

    const handleHexDragLeave = () => setDragOverHexIdx(null);

    const handleCanvasMouseUp = () => {
        clearDragState();
    };

    // HW Module 우클릭 핸들러 - 컨텍스트 메뉴 표시
    const handleHWModuleContextMenu = (e, idx) => {
        e.preventDefault();
        const hwModule = hwModules[idx];

        if (hwModule && !hwModule.isComposite) {
            // 컨텍스트 메뉴 표시
            const contextMenu = document.createElement('div');
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '1px solid #ccc';
            contextMenu.style.borderRadius = '4px';
            contextMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            contextMenu.style.zIndex = '1000';
            contextMenu.style.padding = '4px 0';

            const menuItem = document.createElement('div');
            menuItem.textContent = 'Save as Composite Module';
            menuItem.style.padding = '8px 16px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.fontSize = '14px';
            menuItem.onmouseover = () => menuItem.style.backgroundColor = '#f0f0f0';
            menuItem.onmouseout = () => menuItem.style.backgroundColor = 'transparent';
            menuItem.onclick = () => {
                if (onOpenCompositeWizard) {
                    onOpenCompositeWizard(idx, hwModule);
                }
                document.body.removeChild(contextMenu);
            };

            contextMenu.appendChild(menuItem);
            document.body.appendChild(contextMenu);

            // 다른 곳 클릭 시 메뉴 제거
            const removeMenu = (event) => {
                if (!contextMenu.contains(event.target)) {
                    // 안전하게 노드 제거
                    try {
                        if (contextMenu.parentNode) {
                            contextMenu.remove();
                        }
                    } catch (error) {
                        console.warn('Context menu removal failed:', error);
                    }
                    document.removeEventListener('click', removeMenu);
                }
            };

            setTimeout(() => {
                document.addEventListener('click', removeMenu);
            }, 100);
        }
    };


    // 모듈 타입에 따른 색상 반환
    const getModuleTypeColor = (type) => {
        switch (type) {
            case 'edge':
                return '#4CAF50'; // 녹색
            case 'cloud':
                return '#2196F3'; // 파란색
            case 'controller':
                return '#FF9800'; // 주황색
            default:
                return '#9E9E9E'; // 회색
        }
    };

    return (
        <div
            ref={canvasRef}
            className={`hexagon-canvas-container ${draggedModuleIdx !== null ? 'dragging' : ''}`}
            style={{
                width: '100%',
                height: '100%',
                minHeight: 600
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
        >
            {console.log('Canvas 렌더링 - hwModules:', hwModules)}
            {hwModules.map((hw, idx) => {
                console.log(`HW 모듈 ${idx} 렌더링:`, hw);
                // 모든 HW 모듈을 육각형으로 통일
                return (
                    <div
                        key={idx}
                        data-hw-idx={idx}
                        data-module-type={hw.moduleType}
                        className={`hw-module-container ${draggedModuleIdx === idx ? 'dragging' : ''} ${dragOverHexIdx === idx ? 'drag-over' : ''}`}
                        style={{
                            left: hw.x - 120,
                            top: hw.y - 120,
                            position: 'absolute',
                            pointerEvents: 'auto'
                        }}
                        onDrop={e => handleHexDrop(e, idx)}
                        onDragOver={e => handleHexDragOver(e, idx)}
                        onDragLeave={handleHexDragLeave}
                        onMouseDown={e => handleModuleMouseDown(e, idx)}
                        onContextMenu={e => handleHWModuleContextMenu(e, idx)}
                    >
                        <div className="hw-module-inner">
                            {/* 모듈 타입에 따라 다른 모양 렌더링 */}
                            {hw.isComposite ? (
                                // Composite 모듈은 항상 육각형으로 표시
                                <Hexagon
                                    size={240}
                                    color={getModuleTypeColor(hw.originalModuleType || hw.moduleType)}
                                />
                            ) : hw.moduleType === 'controller' ? (
                                // Controller 모듈은 직사각형으로 표시
                                <Rectangle
                                    size={240}
                                    color={getModuleTypeColor(hw.moduleType)}
                                />
                            ) : (
                                // Edge, Cloud 모듈은 육각형으로 표시
                                <Hexagon
                                    size={240}
                                    color={getModuleTypeColor(hw.moduleType)}
                                />
                            )}
                            <div className="hw-module-label">
                                {hw.name} {hw.isComposite ? '(Composite)' : `(${hw.moduleType})`}
                            </div>
                            {/* SW 모듈(원형) 렌더 */}
                            {hw.swModules && hw.swModules.map((sw, swIdx) => (
                                <div
                                    key={swIdx}
                                    data-hw-idx={idx}
                                    data-module-type={sw.moduleType}
                                    className="sw-module-container"
                                    style={{
                                        left: 120 + (sw.x || 0) - 30,
                                        top: 120 + (sw.y || 0) - 30
                                    }}
                                    draggable={true}
                                    onDragStart={e => handleSWModuleMouseDown(e, idx, swIdx)}
                                    onMouseDown={e => handleSWModuleMouseDown(e, idx, swIdx)}
                                >
                                    <Circle size={60} color="#FFEB3B" />
                                    <div className="sw-module-label">
                                        {sw.name} ({sw.moduleType})
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

Canvas.displayName = 'Canvas';

export default Canvas; 