'use client';

import { useState, useCallback } from 'react';
import { useWindowManager, type WindowId } from '@/hooks/useWindowManager';
import { Window } from '@/components/window/Window';
import { Taskbar } from '@/components/taskbar/Taskbar';
import { DesktopIcon } from './DesktopIcon';
import { AboutWindow } from '@/components/windows/AboutWindow';
import { ProjectsWindow } from '@/components/windows/ProjectsWindow';
import { ProjectDetail } from '@/components/windows/ProjectDetail';
import { SkillsWindow } from '@/components/windows/SkillsWindow';
import { ContactWindow } from '@/components/windows/ContactWindow';
import { ResumeWindow } from '@/components/windows/ResumeWindow';
import { SolitaireWindow } from '@/components/windows/SolitaireWindow';
import { projects } from '@/data/projects';

const MAIN_WINDOWS: WindowId[] = ['about', 'projects', 'skills', 'contact', 'resume'];

const windowMeta: Record<string, { icon: string; label: string }> = {
  about: { icon: '👤', label: 'About Me' },
  projects: { icon: '📁', label: 'Projects' },
  skills: { icon: '⚡', label: 'Skills' },
  contact: { icon: '📧', label: 'Contact' },
  resume: { icon: '📄', label: 'Resume' },
  solitaire: { icon: '🃏', label: 'Solitaire' },
};

const initSizes: Record<string, { w: number; h: number }> = {
  about:    { w: 480, h: 240 },
  projects: { w: 480, h: 300 },
  skills:   { w: 380, h: 340 },
  contact:  { w: 360, h: 240 },
  resume:   { w: 580, h: 460 },
  solitaire:{ w: 640, h: 600 },
};

function getProjectMeta(id: WindowId) {
  const projectId = String(id).replace('project-', '');
  const project = projects.find((p) => p.id === projectId);
  return project ? { icon: project.icon, label: project.name } : { icon: '📄', label: projectId };
}

export function Desktop() {
  const { windows, openedIds, openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow, updatePosition, updateSize } =
    useWindowManager();

  const [mobileSheet, setMobileSheet] = useState<string | null>(null);
  const [everOpened, setEverOpened] = useState<Set<WindowId>>(new Set());

  const handleOpen = useCallback(
    (id: WindowId) => {
      const size = initSizes[id] ?? initSizes['projects'];
      openWindow(id, size.w, size.h);
      setEverOpened((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    [openWindow],
  );

  const allMainOpened = MAIN_WINDOWS.every((id) => everOpened.has(id));

  const desktopIcons: { icon: string; label: string; id: WindowId }[] = [
    { icon: '👤', label: 'About Me', id: 'about' },
    { icon: '📁', label: 'Projects', id: 'projects' },
    { icon: '⚡', label: 'Skills', id: 'skills' },
    { icon: '📄', label: 'Resume', id: 'resume' },
    { icon: '📧', label: 'Contact', id: 'contact' },
    ...(allMainOpened ? [{ icon: '🃏', label: 'Solitaire.exe', id: 'solitaire' as WindowId }] : []),
  ];

  function renderWindowContent(id: WindowId) {
    if (id === 'about') return <AboutWindow />;
    if (id === 'projects') return <ProjectsWindow onOpenProject={handleOpen} />;
    if (id === 'skills') return <SkillsWindow />;
    if (id === 'contact') return <ContactWindow />;
    if (id === 'resume') return <ResumeWindow />;
    if (id === 'solitaire') return <SolitaireWindow />;
    if (String(id).startsWith('project-')) {
      const projectId = String(id).replace('project-', '');
      const project = projects.find((p) => p.id === projectId);
      return project ? <ProjectDetail project={project} /> : null;
    }
    return null;
  }

  const allMeta: Record<string, { icon: string; label: string }> = { ...windowMeta };
  windows.forEach((w) => {
    if (String(w.id).startsWith('project-')) {
      allMeta[w.id] = getProjectMeta(w.id);
    }
  });

  return (
    <>
      {/* Desktop (hidden on mobile) */}
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: 'var(--win98-desktop)',
          overflow: 'hidden',
        }}
        className="hidden sm:block"
      >
        {/* Desktop icons column */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              icon={icon.icon}
              label={icon.label}
              onOpen={() => handleOpen(icon.id)}
            />
          ))}
        </div>

        {/* Windows */}
        {windows.map((w) => {
          const meta = allMeta[w.id] ?? { icon: '🪟', label: w.id };
          return (
            <Window
              key={w.id}
              id={w.id}
              title={meta.label}
              icon={meta.icon}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              zIndex={w.zIndex}
              minimized={w.minimized}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onMove={updatePosition}
              onResize={updateSize}
            >
              {renderWindowContent(w.id)}
            </Window>
          );
        })}

        <Taskbar
          windows={windows}
          onOpen={handleOpen}
          onRestore={restoreWindow}
          onMinimize={minimizeWindow}
          windowMeta={allMeta}
        />
      </div>

      {/* Mobile fallback */}
      <div
        className="sm:hidden"
        style={{ minHeight: '100vh', background: 'var(--win98-desktop)', padding: 16, paddingBottom: 32 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {desktopIcons.map((icon) => (
            <button
              key={icon.id}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 8 }}
              onClick={() => setMobileSheet(icon.id)}
            >
              <span style={{ fontSize: 36 }}>{icon.icon}</span>
              <span style={{ color: 'white', fontSize: 12, textShadow: '1px 1px 2px rgba(0,0,0,0.9)', textAlign: 'center' }}>
                {icon.label}
              </span>
            </button>
          ))}
        </div>

        {mobileSheet && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
              onClick={() => setMobileSheet(null)}
            />
            <div
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 51,
                background: 'var(--win98-gray)', border: '2px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                maxHeight: '80vh', overflowY: 'auto',
                animation: 'bottom-sheet-up 0.25s ease',
              }}
            >
              <div className="win98-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{allMeta[mobileSheet]?.icon ?? '🪟'} {allMeta[mobileSheet]?.label ?? mobileSheet}</span>
                <button className="win98-btn" style={{ fontSize: 10, padding: '0 4px' }} onClick={() => setMobileSheet(null)}>✕</button>
              </div>
              <div style={{ padding: 16 }}>
                {renderWindowContent(mobileSheet as WindowId)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
