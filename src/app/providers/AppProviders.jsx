import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/i18n'
import { ThemeProvider } from './ThemeProvider'
import { BookingProvider } from './BookingProvider'

/** One place to compose cross-cutting context. Order matters: router outermost. */
export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <BookingProvider>{children}</BookingProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
