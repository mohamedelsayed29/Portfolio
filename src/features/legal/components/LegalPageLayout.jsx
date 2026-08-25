import { Seo } from '@components/common'
import { Container } from '@components/layout'
import { LEGAL } from '@constants/legal'

export function LegalPageLayout({ title, introduction, sections, children }) {
  return (
    <>
      <Seo />

      <main className="pb-24 sm:pb-32">
        <Container width="default">
          <article>
            <header className="border-b border-line pt-14 pb-12 sm:pt-20 sm:pb-16">
              <p className="mb-5 font-mono text-[11px] font-medium tracking-[0.1em] text-text-subtle uppercase">
                {LEGAL.companyName} / Legal
              </p>
              <h1 className="max-w-[14ch] text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
                {title}
              </h1>
              <p className="mt-6 max-w-[62ch] text-[17px] leading-7 text-text-muted sm:text-[18px] sm:leading-8">
                {introduction}
              </p>
              <p className="mt-7 text-[13px] text-text-subtle">
                Last updated:{' '}
                <time dateTime={LEGAL.lastUpdated.iso}>{LEGAL.lastUpdated.label}</time>
              </p>
            </header>

            <div className="grid gap-12 pt-10 md:grid-cols-[minmax(0,12rem)_minmax(0,720px)] md:justify-between md:gap-16 md:pt-14">
              <aside className="md:sticky md:top-28 md:self-start">
                <nav aria-label={`${title} contents`}>
                  <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.09em] text-text-subtle uppercase">
                    Contents
                  </h2>
                  <ol className="grid gap-2.5">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="group flex items-baseline gap-3 rounded-[6px] text-[13px] leading-5 text-text-muted transition-colors duration-200 hover:text-text"
                        >
                          <span
                            className="font-mono text-[10px] text-text-subtle transition-colors duration-200 group-hover:text-accent"
                            aria-hidden="true"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span>{section.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <div>{children}</div>
            </div>
          </article>
        </Container>
      </main>
    </>
  )
}
