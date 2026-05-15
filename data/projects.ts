export interface Project {
  id: string;
  icon: string;
  name: string;
  type: string;
  stack: string[];
  description: string;
  github: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: 'cartable',
    icon: '🛒',
    name: 'Cartable',
    type: 'Full Stack',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Groq AI', 'Kroger API'],
    description: 'AI-powered meal planning app with drag-and-drop weekly planning, pantry tracking, smart shopping list consolidation, and one-click Kroger cart sync.',
    github: 'https://github.com/sahana631/cartable',
  },
];
