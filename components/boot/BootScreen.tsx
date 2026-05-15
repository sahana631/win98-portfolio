'use client';

import { useState, useEffect } from 'react';

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2500;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setFadingOut(true);
        setTimeout(onDone, 600);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: fadingOut ? 0 : 1,
        transition: fadingOut ? 'opacity 0.6s ease' : 'none',
      }}
    >
      {/* Win98 text logo */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          textAlign: 'center',
          marginBottom: 40,
          lineHeight: 1.2,
        }}
      >
        <div style={{ color: '#c0c0c0', fontSize: 11 }}>Microsoft</div>
        <div
          style={{
            color: '#ffffff',
            fontSize: 36,
            fontWeight: 'bold',
            fontFamily: 'Arial, system-ui, sans-serif',
            letterSpacing: 2,
          }}
        >
          Windows<span style={{ color: '#008080' }}>98</span>
        </div>
        <div style={{ color: '#808080', fontSize: 10, marginTop: 4 }}>
          Second Edition
        </div>
      </div>

      <div style={{ color: '#c0c0c0', fontSize: 11, marginBottom: 12, fontFamily: 'Arial, system-ui' }}>
        Starting Windows 98...
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 200,
          height: 16,
          border: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          background: '#000000',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: `repeating-linear-gradient(
              90deg,
              #000080 0px, #000080 3px,
              #1a52a8 3px, #1a52a8 4px
            )`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}
