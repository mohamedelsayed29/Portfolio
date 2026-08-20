import { AppProviders } from './providers'
import { AppRouter } from './router'
import { ErrorBoundary } from '@components/common'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  )
}
