import type { WindowId } from '@/hooks/useWindowManager';

interface StartMenuProps {
  onOpen: (id: WindowId) => void;
  onClose: () => void;
}

const items: { icon: string; label: string; id: WindowId }[] = [
  { icon: '👤', label: 'About Me', id: 'about' },
  { icon: '📁', label: 'Projects', id: 'projects' },
  { icon: '⚡', label: 'Skills', id: 'skills' },
  { icon: '📄', label: 'Resume', id: 'resume' },
  { icon: '📧', label: 'Contact', id: 'contact' },
];

export function StartMenu({ onOpen, onClose }: StartMenuProps) {
  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          zIndex: 100,
          background: 'var(--win98-gray)',
          border: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          display: 'flex',
          minWidth: 180,
        }}
      >
        {/* Side banner */}
        <div
          style={{
            background: 'linear-gradient(to top, #000080, #1084d0)',
            width: 24,
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 11,
              fontWeight: 'bold',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontFamily: 'Arial, system-ui',
              letterSpacing: 1,
            }}
          >
            Windows 98
          </span>
        </div>
        {/* Menu items */}
        <div style={{ flex: 1 }}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onOpen(item.id); onClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '5px 12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Arial, system-ui, sans-serif',
                fontSize: 11,
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--win98-navy)';
                (e.currentTarget as HTMLButtonElement).style.color = 'white';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'none';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--win98-text)';
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid #808080', margin: '4px 0' }} />
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '5px 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Arial, system-ui, sans-serif',
              fontSize: 11,
            }}
          >
            <span style={{ fontSize: 16 }}>🔌</span>
            Shut Down...
          </button>
        </div>
      </div>
    </>
  );
}
