import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@constants/navigation'
import { useLocalized, useStrings } from '@/i18n'
import { useScrollPosition, useScrolledPastViewport } from '@hooks'
import { cn } from '@lib/cn'
import { Button } from '@components/ui'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { MobileMenu } from './MobileMenu'

const STRINGS = {
  en: {
    primaryNav: 'Primary',
    bookCall: 'Book a call',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  ar: {
    primaryNav: 'التنقل الرئيسي',
    bookCall: 'احجز مكالمة',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
  },
}

/**
 * A floating pill with two independent states, because they change at very
 * different moments:
 *
 * - `raised`  — on the home page at rest the pill sits low inside the hero
 *               panel, then glides up and docks as soon as you start scrolling.
 *               Driven by a small scroll offset so it reacts immediately.
 * - `onDark`  — the pill is over the dark hero panel and needs light-on-dark
 *               styling. That lasts until the panel has actually scrolled past,
 *               which is most of a viewport later.
 *
 * Both can be true at once: docked at the top but still over the dark panel.
 * The travel is a transform, not a padding change, so it stays on the compositor.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navLinks = useLocalized(NAV_LINKS)
  const s = useStrings(STRINGS)

  const scrolled = useScrollPosition(48)
  const pastHero = useScrolledPastViewport(0.85)

  const isHome = pathname === '/'
  const onDark = isHome && !pastHero && !menuOpen
  const raised = isHome && !scrolled && !menuOpen

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <div
          className={cn(
            'pointer-events-auto mx-auto flex h-14 w-full max-w-[1320px] items-center justify-between gap-6',
            'rounded-full border py-2 pe-2 ps-4 backdrop-blur-xl sm:ps-6',
            'transition-[transform,background-color,border-color,box-shadow] duration-[600ms] ease-[var(--ease-apple)]',
            'will-change-transform',
            raised ? 'translate-y-7 sm:translate-y-9' : 'translate-y-0',
            onDark ? 'border-white/12 bg-white/8' : 'border-glass-border bg-glass',
            !raised && (onDark ? 'shadow-[0_8px_32px_rgba(0,0,0,0.35)]' : 'shadow-card'),
          )}
        >
          <Logo onDark={onDark} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label={s.primaryNav}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-[14px] font-medium tracking-[-0.01em]',
                    'transition-colors duration-300',
                    onDark
                      ? isActive && link.to !== '/#process'
                        ? 'text-white'
                        : 'text-white/65 hover:text-white'
                      : isActive && link.to !== '/#process'
                        ? 'text-text'
                        : 'text-text-muted hover:text-text',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageToggle onDark={onDark} />
            <ThemeToggle onDark={onDark} />
            <Button
              to="/book"
              size="sm"
              variant={onDark ? 'inverse' : 'primary'}
              className="max-sm:hidden"
            >
              {s.bookCall}
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? s.closeMenu : s.openMenu}
              aria-expanded={menuOpen}
              className={cn(
                'grid size-10 place-items-center rounded-full transition-colors lg:hidden',
                onDark ? 'text-white hover:bg-white/10' : 'text-text hover:bg-surface-muted',
              )}
            >
              {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
