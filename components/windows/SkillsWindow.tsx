import { skills } from '@/data/skills';

export function SkillsWindow() {
  return (
    <div className="mono" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ color: '#555', marginBottom: 4 }}>[skills.ini]</div>
      {skills.map((skill) => (
        <div key={skill.name} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{skill.name}</span>
            <span>{skill.level}%</span>
          </div>
          <div
            style={{
              height: 14,
              background: 'white',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${skill.level}%`,
                height: '100%',
                background: `repeating-linear-gradient(
                  90deg,
                  #000080 0px, #000080 3px,
                  #1a52a8 3px, #1a52a8 4px
                )`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
