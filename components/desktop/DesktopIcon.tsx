'use client';

import { useState } from 'react';

interface DesktopIconProps {
  icon: string;
  label: string;
  onOpen: () => void;
}

export function DesktopIcon({ icon, label, onOpen }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      style={{
        background: selected ? 'rgba(0,0,128,0.5)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: 96,
        padding: 6,
        outline: selected ? '1px dotted white' : 'none',
      } as React.CSSProperties}
      onClick={() => setSelected(true)}
      onDoubleClick={onOpen}
      onBlur={() => setSelected(false)}
    >
      <span style={{ fontSize: 52, lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          color: 'white',
          fontSize: 13,
          textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
          textAlign: 'center',
          wordBreak: 'break-word',
          fontFamily: 'Arial, system-ui, sans-serif',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </button>
  );
}
