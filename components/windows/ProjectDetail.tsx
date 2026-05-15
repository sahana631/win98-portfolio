import type { Project } from '@/data/projects';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 28 }}>{project.icon}</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 13 }}>{project.name}</div>
          <div style={{ color: '#555' }}>{project.type}</div>
        </div>
      </div>
      <div style={{ lineHeight: 1.6 }}>{project.description}</div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Stack</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.stack.map((s) => (
            <span
              key={s}
              style={{
                border: '1px solid #808080',
                padding: '1px 5px',
                background: 'white',
                fontSize: 11,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="win98-btn"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          🐙 GitHub
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="win98-btn"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            🌐 Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
