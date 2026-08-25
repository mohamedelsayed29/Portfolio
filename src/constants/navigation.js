import { LEGAL } from './legal'

export const NAV_LINKS = [
  { label: { en: 'Work', ar: 'الأعمال' }, to: '/work' },
  { label: { en: 'Services', ar: 'الخدمات' }, to: '/services' },
  { label: { en: 'Process', ar: 'منهجية العمل' }, to: '/#process' },
  { label: { en: 'About', ar: 'من نحن' }, to: '/about' },
]

export const FOOTER_SECTIONS = [
  {
    title: { en: 'Capabilities', ar: 'قدراتنا' },
    links: [
      {
        label: { en: 'Frontend engineering', ar: 'هندسة الواجهات الأمامية' },
        to: '/services#frontend',
      },
      { label: { en: 'Backend & APIs', ar: 'الأنظمة الخلفية وواجهات API' }, to: '/services#backend' },
      { label: { en: 'Mobile apps', ar: 'تطبيقات الموبايل' }, to: '/services#mobile' },
      { label: { en: 'AI, LLM & models', ar: 'الذكاء الاصطناعي والنماذج اللغوية' }, to: '/services#ai' },
      { label: { en: 'Bug fixing & rescue', ar: 'إصلاح الأخطاء وإنقاذ المشاريع' }, to: '/services#bugfix' },
    ],
  },
  {
    title: { en: 'Company', ar: 'الشركة' },
    links: [
      { label: { en: 'Selected work', ar: 'أعمال مختارة' }, to: '/work' },
      { label: { en: 'About us', ar: 'من نحن' }, to: '/about' },
      { label: { en: 'Process', ar: 'منهجية العمل' }, to: '/#process' },
      { label: { en: 'Contact', ar: 'تواصل معنا' }, to: '/book' },
    ],
  },
]

export const LEGAL_LINKS = [
  { label: { en: 'Privacy', ar: 'الخصوصية' }, to: LEGAL.privacyUrl },
  { label: { en: 'Terms', ar: 'الشروط' }, to: LEGAL.termsUrl },
  { label: { en: 'Data Deletion', ar: 'حذف البيانات' }, to: LEGAL.dataDeletionUrl },
]
