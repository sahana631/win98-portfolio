'use client';

import { useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableResult {
  onMouseDown: (e: React.MouseEvent) => void;
}

export function useDraggable(
  posRef: React.MutableRefObject<Position>,
  onMove: (pos: Position) => void,
): UseDraggableResult {
  const dragging = useRef(false);
  const startMouse = useRef<Position>({ x: 0, y: 0 });
  const startPos = useRef<Position>({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...posRef.current };

      const onMouseMove = (me: MouseEvent) => {
        if (!dragging.current) return;
        const dx = me.clientX - startMouse.current.x;
        const dy = me.clientY - startMouse.current.y;
        const taskbarHeight = 30;
        const newX = Math.max(0, Math.min(window.innerWidth - 200, startPos.current.x + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - taskbarHeight - 30, startPos.current.y + dy));
        onMove({ x: newX, y: newY });
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [posRef, onMove],
  );

  return { onMouseDown };
}
