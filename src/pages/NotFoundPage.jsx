import { ArrowRight } from 'lucide-react'
import { Container } from '@components/layout'
import { Seo, PageTransition } from '@components/common'
import { Button } from '@components/ui'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <Seo title="Page not found" noIndex />

      <Container className="grid min-h-[70vh] place-items-center text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-mono text-[13px] tracking-[0.1em] text-text-subtle">404</p>
          <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] leading-tight font-semibold">
            This page moved on.
          </h1>
          <p className="max-w-[44ch] text-[17px] text-text-muted">
            The link is broken or the page never existed. The work is still where you left it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/" icon={ArrowRight}>
              Back home
            </Button>
            <Button to="/work" variant="secondary">
              Browse work
            </Button>
          </div>
        </div>
      </Container>
    </PageTransition>
  )
}
