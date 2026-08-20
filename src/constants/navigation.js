export const NAV_LINKS = [
  { label: 'Work', to: '/work' },
  { label: 'Services', to: '/services' },
  { label: 'Process', to: '/#process' },
  { label: 'About', to: '/about' },
]

export const FOOTER_SECTIONS = [
  {
    title: 'Services',
    links: [
      { label: 'Frontend engineering', to: '/services#frontend' },
      { label: 'Backend & APIs', to: '/services#backend' },
      { label: 'Mobile apps', to: '/services#mobile' },
      { label: 'AI, LLM & models', to: '/services#ai' },
      { label: 'Bug fixing & rescue', to: '/services#bugfix' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Selected work', to: '/work' },
      { label: 'About us', to: '/about' },
      { label: 'Process', to: '/#process' },
      { label: 'Book a call', to: '/book' },
    ],
  },
  {
    title: 'Engage',
    links: [
      { label: 'Book a project', to: '/book?type=project' },
      { label: 'Book a meeting', to: '/book?type=meeting' },
      { label: 'Bug triage sprint', to: '/book?type=project&service=bugfix' },
      { label: 'Technical audit', to: '/book?type=meeting&service=ai' },
    ],
  },
]
