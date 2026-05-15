'use client';

import { useState } from 'react';
import { useClock } from '@/hooks/useClock';
import { StartMenu } from './StartMenu';
import { TaskbarButton } from './TaskbarButton';
import type { WindowState, WindowId } from '@/hooks/useWindowManager';

interface TaskbarProps {
  windows: WindowState[];
  onOpen: (id: WindowId) => void;
  onRestore: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  windowMeta: Record<string, { icon: string; label: string }>;
}

export function Taskbar({ windows, onOpen, onRestore, onMinimize, windowMeta }: TaskbarProps) {
  const [startOpen, setStartOpen] = useState(false);
  const time = useClock();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        background: 'var(--win98-gray)',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '0 4px',
        zIndex: 200,
      }}
    >
      {/* Start button */}
      <button
        className="win98-btn"
        style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4, height: 22 }}
        onClick={() => setStartOpen((o) => !o)}
      >
        <span>🪟</span> Start
      </button>

      {startOpen && <StartMenu onOpen={onOpen} onClose={() => setStartOpen(false)} />}

      <div style={{ width: 1, height: 22, background: '#808080', margin: '0 2px' }} />

      {/* Window buttons */}
      <div style={{ display: 'flex', gap: 3, flex: 1, overflow: 'hidden' }}>
        {windows.map((w) => {
          const meta = windowMeta[w.id] ?? { icon: '🪟', label: w.id };
          return (
            <TaskbarButton
              key={w.id}
              icon={meta.icon}
              label={meta.label}
              minimized={w.minimized}
              onClick={() => (w.minimized ? onRestore(w.id) : onMinimize(w.id))}
            />
          );
        })}
      </div>

      {/* Clock */}
      <div
        style={{
          border: '1px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: '2px 6px',
          fontFamily: 'Arial, system-ui, sans-serif',
          fontSize: 11,
          minWidth: 50,
          textAlign: 'center',
        }}
      >
        {time}
      </div>
    </div>
  );
}
