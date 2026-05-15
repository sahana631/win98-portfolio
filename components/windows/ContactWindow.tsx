import { contactLinks } from '@/data/contact';

export function ContactWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ color: '#555', marginBottom: 4, fontStyle: 'italic' }}>
        Shortcut links — double-click to open
      </div>
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 6px',
            textDecoration: 'none',
            color: 'var(--win98-text)',
            border: '2px solid transparent',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--win98-navy)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--win98-text)';
          }}
        >
          <span style={{ fontSize: 18 }}>{link.icon}</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>{link.label}</div>
            <div style={{ fontSize: 10 }}>{link.display}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
