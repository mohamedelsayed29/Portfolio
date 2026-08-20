import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { FOOTER_SECTIONS } from '@constants/navigation'
import { SITE } from '@constants/site'
import { Container } from './Container'
import { Logo } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="hairline mt-8 bg-surface-muted/50 pt-20 pb-10">
      <Container width="wide">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-[38ch] text-[15px] leading-relaxed text-text-muted">
              {SITE.description}
            </p>

            <div className="flex flex-col gap-2.5 text-[14px] text-text-muted">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-text"
              >
                <Mail size={15} aria-hidden="true" />
                {SITE.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} aria-hidden="true" />
                {SITE.location}
              </span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <nav key={section.title} aria-label={section.title} className="flex flex-col gap-4">
                <h3 className="text-[13px] font-semibold tracking-[-0.005em] text-text">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[14px] text-text-muted transition-colors hover:text-text"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="hairline mt-16 flex flex-col-reverse items-start justify-between gap-6 pt-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-text-subtle">
            © {year} {SITE.name}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-5">
            {SITE.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1 text-[13px] text-text-muted transition-colors hover:text-text"
                >
                  {social.label}
                  <ArrowUpRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-[var(--ease-apple)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
