import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { FOOTER_SECTIONS, LEGAL_LINKS } from '@constants/navigation'
import { SITE } from '@constants/site'
import { localizedPath, useLanguage, useLocalized, useStrings } from '@/i18n'
import { Container } from './Container'
import { Logo } from './Logo'

const footerLinkClasses =
  'group inline-flex w-fit items-center gap-1.5 rounded-[6px] text-[14px] leading-6 text-text-muted transition-colors duration-200 hover:text-text'

const STRINGS = {
  en: {
    description:
      'We design, build and rescue serious software across web, mobile, backend and AI systems.',
    rightsReserved: 'All rights reserved.',
    opensInNewTab: '(opens in a new tab)',
    legalNav: 'Legal',
  },
  ar: {
    description:
      'نصمّم برمجيات يُعتمد عليها ونبنيها وننقذها — عبر الويب والموبايل والأنظمة الخلفية والذكاء الاصطناعي.',
    rightsReserved: 'جميع الحقوق محفوظة.',
    opensInNewTab: '(يفتح في نافذة جديدة)',
    legalNav: 'روابط قانونية',
  },
}

export function Footer() {
  const year = new Date().getFullYear()
  const { language } = useLanguage()
  const sections = useLocalized(FOOTER_SECTIONS)
  const legalLinks = useLocalized(LEGAL_LINKS)
  const site = useLocalized(SITE)
  const s = useStrings(STRINGS)

  return (
    <footer className="bg-bg-elevated text-text dark:bg-[#08090b]">
      <Container width="wide">
        <div className="grid gap-10 py-11 sm:py-12 md:grid-cols-[minmax(0,1.35fr)_minmax(0,.75fr)_minmax(0,.65fr)] md:gap-10 lg:gap-16 lg:py-14">
          <div className="flex max-w-[430px] flex-col items-start gap-5">
            <Logo className="min-w-0" />
            <p className="max-w-[39ch] text-[15px] leading-6 text-text-muted">{s.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-9 md:contents">
            {sections.map((section) => (
              <nav key={section.title} aria-label={section.title} className="min-w-0">
                <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.08em] text-text-subtle uppercase">
                  {section.title}
                </h2>
                <ul className="grid gap-2">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={localizedPath(link.to, language)} className={footerLinkClasses}>
                        <span>{link.label}</span>
                        <ArrowRight
                          size={12}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          className="opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 text-[12px] text-text-subtle sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <p>
              © {year} {site.name}. {s.rightsReserved}
            </p>
            <address className="not-italic">{site.location}</address>
            <nav aria-label={s.legalNav}>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={localizedPath(link.to, language)}
                      className="rounded-[5px] transition-colors duration-200 hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${social.label} ${s.opensInNewTab}`}
                  className="group inline-flex items-center gap-1 rounded-[5px] text-[12px] text-text-subtle transition-colors duration-200 hover:text-text"
                >
                  {social.label}
                  <ArrowUpRight
                    size={11}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
