import { useRef, useCallback, useEffect } from 'react';
import { COLS } from './config';

const DRAG_THRESHOLD = 15;
const DOUBLE_TAP_MS = 300;

export default function useTouchInput(boardRef, { moveLeft, moveRight, moveToColumn, startSoftDrop, doHold, active }) {
  const touchStart = useRef(null);
  const lastTap = useRef(0);
  const dragDir = useRef(0); // cumulative column shifts during this drag
  const isDragging = useRef(false);
  const startCol = useRef(null);

  const getCellWidth = useCallback(() => {
    if (!boardRef.current) return 48;
    return boardRef.current.offsetWidth / COLS;
  }, [boardRef]);

  const getColumnFromX = useCallback((x) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const relX = x - rect.left;
    const col = Math.floor(relX / getCellWidth());
    return Math.max(0, Math.min(COLS - 1, col));
  }, [boardRef, getCellWidth]);

  const handleTouchStart = useCallback((e) => {
    if (!active) return;
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    isDragging.current = false;
    startCol.current = active.c;
    dragDir.current = 0;
  }, [active]);

  const handleTouchMove = useCallback((e) => {
    if (!active || !touchStart.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.current.x;

    if (!isDragging.current && Math.abs(dx) > DRAG_THRESHOLD) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      e.preventDefault();
      const cellW = getCellWidth();
      const colShift = Math.round(dx / cellW);

      if (colShift !== dragDir.current) {
        const targetCol = startCol.current + colShift;
        moveToColumn(targetCol);
        dragDir.current = colShift;
      }
    }
  }, [active, getCellWidth, moveToColumn]);

  const handleTouchEnd = useCallback((e) => {
    if (!active || !touchStart.current) return;

    if (!isDragging.current) {
      const now = Date.now();
      const timeSinceLast = now - lastTap.current;

      if (timeSinceLast < DOUBLE_TAP_MS) {
        // Double-tap — determine target column and soft-drop
        const touch = e.changedTouches[0];
        const targetCol = getColumnFromX(touch.clientX);

        if (targetCol !== null && targetCol !== active.c) {
          moveToColumn(targetCol);
        }
        startSoftDrop();
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }

    touchStart.current = null;
    isDragging.current = false;
  }, [active, getColumnFromX, moveToColumn, startSoftDrop]);

  // Keyboard support for development/testing
  const handleKeyDown = useCallback((e) => {
    if (!active) return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveRight();
        break;
      case 'ArrowDown':
        e.preventDefault();
        startSoftDrop();
        break;
      case 'h':
      case 'H':
        e.preventDefault();
        if (doHold) doHold();
        break;
    }
  }, [active, moveLeft, moveRight, startSoftDrop, doHold]);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [boardRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown]);
}
