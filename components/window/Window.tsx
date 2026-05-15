'use client';

import { useRef, useCallback } from 'react';
import { useDraggable } from '@/hooks/useDraggable';
import type { WindowId } from '@/hooks/useWindowManager';

const MIN_W = 220;
const MIN_H = 150;
const TASKBAR_H = 30;

interface WindowProps {
  id: WindowId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  children: React.ReactNode;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onMove: (id: WindowId, x: number, y: number) => void;
  onResize: (id: WindowId, width: number, height: number) => void;
}

export function Window({
  id, title, icon, x, y, width, height, zIndex, minimized, children,
  onClose, onMinimize, onFocus, onMove, onResize,
}: WindowProps) {
  const posRef = useRef({ x, y });
  posRef.current = { x, y };

  const sizeRef = useRef({ width, height });
  sizeRef.current = { width, height };

  const handleMove = useCallback(
    (pos: { x: number; y: number }) => onMove(id, pos.x, pos.y),
    [id, onMove],
  );

  const { onMouseDown: onTitleMouseDown } = useDraggable(posRef, handleMove);

  const handleResize = useCallback(
    (e: React.MouseEvent, dir: 'e' | 's' | 'se') => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = sizeRef.current.width;
      const startH = sizeRef.current.height;

      const onMouseMove = (me: MouseEvent) => {
        const newW = dir === 's' ? startW : Math.max(MIN_W, startW + me.clientX - startX);
        const newH = dir === 'e' ? startH : Math.max(MIN_H, Math.min(window.innerHeight - TASKBAR_H - y, startH + me.clientY - startY));
        onResize(id, newW, newH);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [id, onResize, y],
  );

  if (minimized) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex,
        width,
        height,
        background: 'var(--win98-gray)',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title bar */}
      <div
        className="win98-title"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none', cursor: 'default', flexShrink: 0 }}
        onMouseDown={onTitleMouseDown}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <span style={{ fontSize: 12 }}>{icon}</span>
          {title}
        </span>
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <button
            className="win98-btn"
            style={{ padding: '0 4px', minWidth: 16, minHeight: 14, fontSize: 10, lineHeight: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onMinimize(id)}
            title="Minimize"
          >_</button>
          <button
            className="win98-btn"
            style={{ padding: '0 4px', minWidth: 16, minHeight: 14, fontSize: 10, lineHeight: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onClose(id)}
            title="Close"
          >✕</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 8, overflow: 'auto', flex: 1 }}>
        {children}
      </div>

      {/* Resize: right edge */}
      <div
        style={{ position: 'absolute', top: 4, right: -4, width: 8, bottom: 8, cursor: 'e-resize' }}
        onMouseDown={(e) => handleResize(e, 'e')}
      />
      {/* Resize: bottom edge */}
      <div
        style={{ position: 'absolute', left: 4, bottom: -4, right: 8, height: 8, cursor: 's-resize' }}
        onMouseDown={(e) => handleResize(e, 's')}
      />
      {/* Resize: bottom-right corner grip */}
      <div
        style={{
          position: 'absolute', right: -4, bottom: -4, width: 14, height: 14,
          cursor: 'se-resize',
          background: `repeating-linear-gradient(
            -45deg,
            transparent 0px, transparent 2px,
            #808080 2px, #808080 3px
          )`,
        }}
        onMouseDown={(e) => handleResize(e, 'se')}
      />
    </div>
  );
}
