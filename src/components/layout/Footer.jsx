import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { FOOTER_SECTIONS } from '@constants/navigation'
import { SITE } from '@constants/site'
import { Container } from './Container'
import { Logo } from './Logo'

const footerLinkClasses =
  'group inline-flex w-fit items-center gap-1.5 rounded-[6px] text-[14px] leading-6 text-text-muted transition-colors duration-200 hover:text-text'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-bg-elevated text-text dark:bg-[#08090b]">
      <Container width="wide">
        <div className="grid gap-10 py-11 sm:py-12 md:grid-cols-[minmax(0,1.35fr)_minmax(0,.75fr)_minmax(0,.65fr)] md:gap-10 lg:gap-16 lg:py-14">
          <div className="flex max-w-[430px] flex-col items-start gap-5">
            <Logo className="min-w-0" />
            <p className="max-w-[39ch] text-[15px] leading-6 text-text-muted">
              We design, build and rescue serious software across web, mobile, backend and AI
              systems.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-9 md:contents">
            {FOOTER_SECTIONS.map((section) => (
              <nav key={section.title} aria-label={section.title} className="min-w-0">
                <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.08em] text-text-subtle uppercase">
                  {section.title}
                </h2>
                <ul className="grid gap-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className={footerLinkClasses}>
                        <span>{link.label}</span>
                        <ArrowRight
                          size={12}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          className="opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-[12px] text-text-subtle sm:flex-row sm:items-center sm:gap-5">
            <p>© {year} {SITE.name}. All rights reserved.</p>
            <address className="not-italic">{SITE.location}</address>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {SITE.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="group inline-flex items-center gap-1 rounded-[5px] text-[12px] text-text-subtle transition-colors duration-200 hover:text-text"
                >
                  {social.label}
                  <ArrowUpRight
                    size={11}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
