# Windows 98 Portfolio — Claude Instructions

## Project overview

A Windows 98-themed personal portfolio website for a full stack engineer. The entire UI mimics a Windows 98 desktop: draggable windows, a taskbar, desktop icons, a Start menu, and a boot screen. Built with Next.js (App Router) and Tailwind CSS. No external UI component libraries.

## Commands

- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npm test` — run Jest tests

## Tech stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS + vanilla CSS for Win98-specific effects
- **Language:** TypeScript strict mode — no `any`
- **Fonts:** System fonts only (Arial, system-ui) — no Google Fonts
- **No external UI libraries** (no shadcn, MUI, Radix, etc.)
- **Animation:** CSS transitions and keyframes only — no Framer Motion
- **Icons:** Emoji only — no icon libraries

## Architecture

```
/app
  layout.tsx              # root layout, loads boot screen
  page.tsx                # desktop shell (icons + taskbar)

/components
  /desktop
    Desktop.tsx           # teal background, positions icons + windows
    DesktopIcon.tsx       # icon + label, single/double click handling
  /window
    Window.tsx            # reusable draggable window shell
    WindowManager.tsx     # tracks open windows, z-index, minimize state
  /taskbar
    Taskbar.tsx           # bottom bar with Start button + clock
    StartMenu.tsx         # popup menu above taskbar
    TaskbarButton.tsx     # one button per open/minimized window
  /windows
    AboutWindow.tsx       # bio + avatar + tech tags
    ProjectsWindow.tsx    # explorer grid of project folders
    ProjectDetail.tsx     # child window: description, stack, links
    SkillsWindow.tsx      # INI-style skill rows with progress bars
    ContactWindow.tsx     # shortcut-style links (email, GitHub, etc.)
    ResumeWindow.tsx      # Notepad-style monospace resume + download
  /boot
    BootScreen.tsx        # startup animation shown on first load

/hooks
  useDraggable.ts         # drag logic (mousedown, mousemove, mouseup)
  useWindowManager.ts     # open/close/minimize/focus window state
  useClock.ts             # live time for taskbar clock

/data
  projects.ts             # project list (name, description, stack, links)
  skills.ts               # skill list (name, level 0–100)
  contact.ts              # contact links
```

## Design rules — follow these exactly

### Colors (use CSS variables, defined in globals.css)

```css
--win98-desktop:    #008080;  /* teal desktop background */
--win98-gray:       #c0c0c0;  /* window background, taskbar */
--win98-navy:       #000080;  /* title bar, Start menu highlight */
--win98-navy-light: #1084d0;  /* title bar gradient end */
--win98-text:       #000000;
--win98-white:      #ffffff;
--win98-dark:       #808080;  /* shadow side of borders */
```

### The Win98 border trick (NO box-shadow or border-radius)

```css
/* Raised (buttons, windows, taskbar) */
border: 2px solid;
border-color: #ffffff #808080 #808080 #ffffff;

/* Sunken (input fields, progress bar tracks, window body) */
border: 2px solid;
border-color: #808080 #ffffff #ffffff #808080;

/* Inset (status bar panels, clock) */
border: 1px solid;
border-color: #808080 #ffffff #ffffff #808080;
```

### Title bar

```css
background: linear-gradient(to right, #000080, #1084d0);
color: white;
font-weight: bold;
font-size: 11px;
padding: 3px 4px;
```

### Progress bars (Skills window)

- Track: sunken border, white background
- Fill: `#000080` with CSS `repeating-linear-gradient` vertical stripes

```css
background: repeating-linear-gradient(
  90deg,
  #000080 0px, #000080 3px,
  #1a52a8 3px, #1a52a8 4px
);
```

### Typography

- Body: `font-family: Arial, system-ui, sans-serif; font-size: 11px;`
- Monospace (Resume, INI): `font-family: 'Courier New', monospace; font-size: 11px;`
- No font smoothing tricks — keep the pixelated feel

### Desktop icons

- Icon: emoji, font-size 26–28px
- Label: white text, `text-shadow: 1px 1px 2px rgba(0,0,0,0.9)`
- Selected state: `background: rgba(0,0,128,0.5); outline: 1px dotted white;`
- Width: 64px, centered

## Window behavior rules

1. **Dragging:** mousedown on title bar starts drag; mousemove on `document` moves the window; mouseup ends drag. Clamp position so window can't go off-screen or under the taskbar (bottom: `window.height - 30px`).
2. **Z-index:** use a counter starting at 10; each time a window is focused, increment and assign. Never hardcode z-index values.
3. **Minimize:** hide the window (`display: none`), keep a taskbar button. Clicking the taskbar button restores it.
4. **Close:** remove window from open state; remove taskbar button.
5. **Focus on open:** newly opened windows are always on top.
6. **Double-click icons** to open; single-click to select.
7. Windows should open at slightly offset positions so they don't stack exactly (offset each new window by +20px top and left).

## Content to fill in

### Projects (edit `/data/projects.ts`)

```ts
{ id: 'stitch-palette', icon: '🧶', name: 'Stitch & Palette',
  type: 'Full Stack', stack: ['React', 'Node.js', 'Postgres', 'PDFKit'],
  description: 'Crochet pattern editor with AI color palette extraction and PDF export.',
  github: 'https://github.com/yourname/stitch-palette',
  demo: 'https://stitch-palette.vercel.app' },
// Add more projects here
```

### Skills (edit `/data/skills.ts`)

```ts
{ name: 'TypeScript', level: 90 },
{ name: 'React',      level: 88 },
{ name: 'Node.js',    level: 85 },
{ name: 'Postgres',   level: 78 },
{ name: 'Docker',     level: 72 },
{ name: 'Terraform',  level: 58 },
// Add or adjust levels to match your actual experience
```

### Personal info (edit throughout)

- Replace `[Your Name]` with your real name
- Replace `hello@yourname.dev` with your real email
- Replace GitHub/LinkedIn URLs in `contact.ts`
- Update the resume content in `ResumeWindow.tsx`

## Special features to implement

### Boot screen

- Full-screen black background on first page load
- Windows 98 logo (text-based, no images)
- Progress bar that fills over ~2.5 seconds
- "Starting Windows 98..." text
- Fades out and reveals desktop when complete
- Store `booted` in `sessionStorage` so it only shows once per session

### Easter egg — Minesweeper

- A hidden `Minesweeper.exe` desktop icon
- Only appears after the user has opened all 5 main windows
- Opens a fully playable Minesweeper game inside a `Window` component
- Classic 9x9 beginner grid, left-click to reveal, right-click to flag

### Mobile fallback (screens < 640px)

- Hide the desktop entirely
- Show a simple 3-column grid of app icons on the teal background
- Tapping an icon opens a bottom sheet (slides up from bottom)
- Bottom sheet contains the same content as the desktop window
- No dragging behavior on mobile

## Coding conventions

- TypeScript strict mode — no `any`, no `// @ts-ignore`
- Components: PascalCase files and function names
- Hooks: camelCase, prefix with `use`
- CSS classes: use Tailwind for layout/spacing; use CSS variables + inline styles for Win98 color/border effects (Tailwind doesn't cover these well)
- No `useEffect` for things that can be done with event handlers
- Keep components small — if a component exceeds ~100 lines, split it
- All window content components live in `/components/windows/`
- Data (projects, skills) lives in `/data/` as typed TypeScript arrays
- Commits: imperative mood, max 72 chars (`"Add draggable Window component"`)

## What NOT to do

- Do NOT use any CSS `border-radius` on Win98 UI elements (windows, buttons, taskbar) — everything is sharp corners
- Do NOT use `box-shadow` for the raised/sunken effect — use the border trick
- Do NOT install Framer Motion, React Spring, or any animation library
- Do NOT use any icon library (Lucide, Heroicons, etc.) — emoji only
- Do NOT use `position: fixed` for windows — use `position: absolute` inside the desktop container
- Do NOT make windows full-screen on desktop — they should feel like actual small windows floating on the desktop
- Do NOT forget the mobile fallback — the draggable desktop is unusable on touch screens

## When you're unsure

If a design decision isn't covered here, ask: "What would Windows 98 actually do?" The answer is almost always: sharp corners, gray background, navy highlight, and a slightly too-small font.
