export function AboutWindow() {
  const tags = ['TypeScript', 'JavaScript', 'React', 'C#', 'Node.js', '.NET', 'Azure', 'Python'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <img
          src="/avatar.jpg"
          alt="Sahana Swaminathan"
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            flexShrink: 0,
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
          }}
        />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Sahana Swaminathan</div>
          <div style={{ color: '#444', fontSize: 13, marginBottom: 8 }}>Software Engineer</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            Hi, I&apos;m Sahana — a software engineer with 3 years of experience at Microsoft
            building enterprise-scale systems used by customers globally. I&apos;m passionate about
            clean APIs, great UX, and delightful little easter eggs. Currently open to new
            opportunities.
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>Technologies</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: 'var(--win98-navy)',
                color: 'white',
                padding: '3px 8px',
                fontSize: 12,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
