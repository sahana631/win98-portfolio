'use client';

import { useState, useCallback, useRef } from 'react';

export type WindowId = 'about' | 'projects' | 'skills' | 'contact' | 'resume' | 'solitaire' | `project-${string}`;

export interface WindowState {
  id: WindowId;
  minimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseWindowManagerResult {
  windows: WindowState[];
  openedIds: Set<WindowId>;
  openWindow: (id: WindowId, initWidth?: number, initHeight?: number, initX?: number, initY?: number) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, x: number, y: number) => void;
  updateSize: (id: WindowId, width: number, height: number) => void;
}

const BASE_OFFSET = 60;
const STACK_OFFSET = 20;

export function useWindowManager(): UseWindowManagerResult {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zCounter = useRef(10);
  const openCount = useRef(0);

  const openedIds = new Set(windows.map((w) => w.id));

  const openWindow = useCallback((id: WindowId, initWidth = 480, initHeight = 300, initX?: number, initY?: number) => {
    setWindows((prev) => {
      if (prev.find((w) => w.id === id)) {
        zCounter.current += 1;
        return prev.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: zCounter.current } : w,
        );
      }
      zCounter.current += 1;
      const offset = BASE_OFFSET + (openCount.current % 8) * STACK_OFFSET;
      openCount.current += 1;
      return [
        ...prev,
        { id, minimized: false, zIndex: zCounter.current, x: initX ?? offset, y: initY ?? offset, width: initWidth, height: initHeight },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const restoreWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      zCounter.current += 1;
      return prev.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: zCounter.current } : w,
      );
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      zCounter.current += 1;
      return prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter.current } : w));
    });
  }, []);

  const updatePosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const updateSize = useCallback((id: WindowId, width: number, height: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
  }, []);

  return { windows, openedIds, openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow, updatePosition, updateSize };
}
