export interface ContactLink {
  icon: string;
  label: string;
  href: string;
  display: string;
}

export const contactLinks: ContactLink[] = [
  {
    icon: '📧',
    label: 'Email',
    href: 'mailto:sahana631@gmail.com',
    display: 'sahana631@gmail.com',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    href: 'https://github.com/sahana631',
    display: 'github.com/sahana631',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/sahana533',
    display: 'linkedin.com/in/sahana533',
  },
];
