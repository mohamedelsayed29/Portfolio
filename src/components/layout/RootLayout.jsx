import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '@components/common'
import { BookingDialog } from '@features/booking'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/** The persistent shell: chrome, scroll behaviour and the global booking dialog. */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      <div className="flex-1 pt-[var(--nav-h)]">
        <Outlet />
      </div>

      <Footer />
      <BookingDialog />
    </div>
  )
}
