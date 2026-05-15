interface TaskbarButtonProps {
  icon: string;
  label: string;
  minimized: boolean;
  onClick: () => void;
}

export function TaskbarButton({ icon, label, minimized, onClick }: TaskbarButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--win98-gray)',
        border: '2px solid',
        borderColor: minimized
          ? '#808080 #ffffff #ffffff #808080'
          : '#ffffff #808080 #808080 #ffffff',
        fontFamily: 'Arial, system-ui, sans-serif',
        fontSize: 11,
        padding: '1px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        minWidth: 100,
        maxWidth: 150,
        height: 22,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </button>
  );
}
