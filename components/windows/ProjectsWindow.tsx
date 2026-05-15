import { projects } from '@/data/projects';
import type { WindowId } from '@/hooks/useWindowManager';

interface ProjectsWindowProps {
  onOpenProject: (id: WindowId) => void;
}

export function ProjectsWindow({ onOpenProject }: ProjectsWindowProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 4px',
          marginBottom: 8,
          background: 'white',
          border: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          fontSize: 11,
        }}
      >
        <span>📁</span>
        <span>C:\Portfolio\Projects</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {projects.map((project) => (
          <button
            key={project.id}
            onDoubleClick={() => onOpenProject(`project-${project.id}` as WindowId)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: 8,
              width: '100%',
            }}
            title={`Double-click to open ${project.name}`}
          >
            <span style={{ fontSize: 28 }}>{project.icon}</span>
            <span style={{ fontSize: 11, textAlign: 'center', wordBreak: 'break-word' }}>
              {project.name}
            </span>
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: 8,
          padding: '2px 4px',
          borderTop: '1px solid #808080',
          color: '#555',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{projects.length} object(s)</span>
      </div>
    </div>
  );
}
