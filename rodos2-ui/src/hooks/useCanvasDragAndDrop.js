import { useCallback } from 'react';
import { calculateDropPosition, calculateHexDropPosition, isWithinHexBoundary, setDragData } from '../utils/canvas/canvasHelpers';

export function useCanvasDragAndDrop(canvasRef, hwModules, dragOffset, draggedModuleIdx, draggedSWModule, setDragState, setSWDragState, clearDragState, addHWModule, addSWModule, removeSWModule, updateHWModulePosition, updateSWModulePosition, setDragOverHexIdx, onOpenCompositeWizard) {

    // 캔버스에 HW 모듈 드롭
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const dragData = e.dataTransfer.getData('text/plain');

        console.log('Canvas handleDrop 호출됨:', { dragData });

        if (!dragData) return;

        try {
            const { type, name, moduleType } = JSON.parse(dragData);
            console.log('드롭 데이터 파싱됨:', { type, name, moduleType });

            const rect = canvasRef.current.getBoundingClientRect();
            const { x, y } = calculateDropPosition(e, rect);
            console.log('드롭 위치 계산됨:', { x, y });

            if (type === 'hw') {
                // Edge, Cloud 모듈을 육각형으로 추가
                console.log('HW 모듈 추가 시도:', { name, x, y, moduleType });
                addHWModule(name, x, y, moduleType);
                console.log('HW 모듈 추가 완료');
            } else if (type === 'controller') {
                // Controller 모듈을 직사각형으로 추가
                console.log('Controller 모듈 추가 시도:', { name, x, y, moduleType });
                addHWModule(name, x, y, moduleType);
                console.log('Controller 모듈 추가 완료');
            }
        } catch (error) {
            console.error('드롭 데이터 파싱 오류:', error);
        }
    }, [canvasRef, addHWModule]);

    // HW 모듈 위에 SW 모듈 드롭 (육각형 또는 직사각형)
    const handleHexDrop = useCallback((e, idx) => {
        e.preventDefault();
        const dragData = e.dataTransfer.getData('text/plain');

        console.log('handleHexDrop 호출됨:', { idx, dragData });

        if (!dragData) return;

        try {
            const { type, name, moduleType, sourceHwIdx, sourceSwIdx } = JSON.parse(dragData);
            console.log('드롭 데이터 파싱됨:', { type, name, moduleType, sourceHwIdx, sourceSwIdx });

            if (type === 'sw') {
                const hwModule = hwModules[idx];

                // Controller 모듈 위에 Software 모듈을 드롭하는 경우 CompositeDialog 열기
                if (hwModule && hwModule.moduleType === 'controller') {
                    console.log('Controller 모듈 위에 SW 모듈 드롭 - CompositeDialog 열기');
                    if (onOpenCompositeWizard) {
                        onOpenCompositeWizard(idx, hwModule);
                    }
                    setDragOverHexIdx(null);
                    return;
                }

                // 육각형 모듈의 경우 - 기존 계산 사용
                const hexRect = e.currentTarget.getBoundingClientRect();
                const { x, y } = calculateHexDropPosition(e, hexRect);
                const relativeX = x;
                const relativeY = y;

                // 기존 SW 모듈을 제거 (다른 HW 모듈에서 이동하는 경우)
                if (sourceHwIdx !== '' && sourceSwIdx !== '') {
                    const sourceHw = parseInt(sourceHwIdx);
                    const sourceSw = parseInt(sourceSwIdx);

                    if (sourceHw !== idx) {
                        removeSWModule(sourceHw, sourceSw);
                    } else {
                        // 같은 HW 모듈 내에서 순서만 바꾸는 경우는 무시
                        setDragOverHexIdx(null);
                        return;
                    }
                }

                // 새로운 위치에 SW 모듈 추가
                console.log('SW 모듈 추가 시도:', { idx, name, relativeX, relativeY, moduleType });
                addSWModule(idx, name, relativeX, relativeY, moduleType);
                console.log('SW 모듈 추가 완료');
            }
        } catch (error) {
            console.error('HW 모듈 드롭 데이터 파싱 오류:', error);
        }

        setDragOverHexIdx(null);
    }, [addSWModule, removeSWModule, setDragOverHexIdx]);

    // 모듈 드래그 시작
    const handleModuleMouseDown = useCallback((e, idx) => {
        e.preventDefault();
        const rect = canvasRef.current.getBoundingClientRect();
        const module = hwModules[idx];
        const offset = {
            x: e.clientX - rect.left - module.x,
            y: e.clientY - rect.top - module.y
        };
        setDragState(idx, offset);
    }, [canvasRef, hwModules, setDragState]);

    // SW 모듈 드래그 시작
    const handleSWModuleMouseDown = useCallback((e, hwIdx, swIdx) => {
        e.preventDefault();
        e.stopPropagation();

        const hexRect = e.currentTarget.parentElement.getBoundingClientRect();
        const swModule = hwModules[hwIdx].swModules[swIdx];

        // 육각형 내부에서의 상대 좌표 계산
        const centerX = 120;
        const centerY = 120;
        const currentX = (swModule.x || 0) + centerX;
        const currentY = (swModule.y || 0) + centerY;

        const offset = {
            x: e.clientX - hexRect.left - currentX,
            y: e.clientY - hexRect.top - currentY
        };

        setSWDragState(hwIdx, swIdx, offset);

        // 드래그 데이터 설정 (다른 육각형으로 이동할 때)
        setDragData(e, 'sw', swModule.name, swModule.type, hwIdx, swIdx);
    }, [hwModules, setSWDragState]);

    // 모듈 드래그 중
    const handleCanvasMouseMove = useCallback((e) => {
        if (draggedModuleIdx !== null && dragOffset !== null) {
            const rect = canvasRef.current.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffset.x;
            const newY = e.clientY - rect.top - dragOffset.y;

            // HW 모듈 위치 업데이트
            updateHWModulePosition(draggedModuleIdx, newX, newY);
        }

        // SW 모듈 드래그 중
        if (draggedSWModule !== null) {
            const hexElement = e.currentTarget.querySelector(`[data-hw-idx="${draggedSWModule.hwIdx}"]`);

            if (hexElement) {
                const hexRect = hexElement.getBoundingClientRect();
                const centerX = 120;
                const centerY = 120;

                const newX = e.clientX - hexRect.left - centerX - draggedSWModule.offset.x;
                const newY = e.clientY - hexRect.top - centerY - draggedSWModule.offset.y;

                // 육각형 경계 내에서만 이동 허용
                if (isWithinHexBoundary(newX, newY)) {
                    updateSWModulePosition(draggedSWModule.hwIdx, draggedSWModule.swIdx, newX, newY);
                }
            }
        }
    }, [canvasRef, dragOffset, draggedModuleIdx, draggedSWModule, updateHWModulePosition, updateSWModulePosition]);

    return {
        handleDrop,
        handleHexDrop,
        handleModuleMouseDown,
        handleSWModuleMouseDown,
        handleCanvasMouseMove
    };
}
