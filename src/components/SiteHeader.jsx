import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../data/healthScreeningData'

export const MMC_LOGO_URL = 'https://maedamedical.com/wp-content/uploads/2026/01/MMC_logo.png'
export const SITE_OLIVE = '#63644A'

/** Maeda reference: left of centered logo */
const NAV_LEFT = NAV_ITEMS.slice(0, 4)
/** Right of centered logo (before CTAs) */
const NAV_RIGHT = NAV_ITEMS.slice(4)

const ICON_TOPBAR = 'h-[18px] w-[18px] shrink-0 text-white/95 sm:h-5 sm:w-5 md:h-6 md:w-6'

function IconPhone({ className = ICON_TOPBAR }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconWhatsApp({ className = ICON_TOPBAR }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function IconMail({ className = ICON_TOPBAR }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconHamburger({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function IconClose({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

function TopBar({ isDark, onToggleTheme }) {
  return (
    <div
      className="relative text-[11px] font-light leading-snug tracking-wide text-white/95 sm:text-sm"
      style={{ backgroundColor:'#63644A' }}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center px-4 py-2 sm:py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-2">
          <span className="inline-flex items-center gap-2 px-2 sm:px-0">
            <IconPhone />
            62980360
          </span>
          <span
            className="mx-3 hidden h-4 w-px shrink-0 bg-white/35 sm:inline md:h-5"
            aria-hidden
          />
          <span className="inline-flex items-center gap-2 px-2 sm:px-0">
            <IconWhatsApp />
            82585070
          </span>
          <span
            className="mx-3 hidden h-4 w-px shrink-0 bg-white/35 sm:inline md:h-5"
            aria-hidden
          />
          <a
            href="mailto:camden.mmc@gmail.com"
            className="inline-flex items-center gap-2 px-2 hover:underline sm:px-0"
          >
            <IconMail />
            camden.mmc@gmail.com
          </a>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/25 p-1.5 text-white/90 hover:bg-white/10 sm:block"
      >
        <span className="block text-xs leading-none" aria-hidden>
          {isDark ? '☀' : '☾'}
        </span>
      </button>
    </div>
  )
}

const navLinkClass =
  'text-[11px] font-normal uppercase tracking-wide text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition xl:text-base'

const OUR_TEAM_DROPDOWN = [
  { name: 'Dr Vyas Prasad', href: 'https://maedamedical.com/our-team/' },
  { name: 'Dr. Behram Ali Khan', href: 'https://maedamedical.com/our-team/' },
]

function NavLinkItem({ item, onNavigate }) {
  const showChevron = item.label === 'OUR SERVICES' || item.label === 'OUR TEAM'
  const hasTeamDropdown = item.label === 'OUR TEAM'

  if (hasTeamDropdown) {
    return (
      <div className="group relative">
        <a
          href={item.href}
          onClick={onNavigate}
          className={`inline-flex items-center gap-0.5 whitespace-nowrap ${navLinkClass}`}
        >
          <span>{item.label}</span>
          {showChevron ? (
            <span className="text-[0.6rem] leading-none opacity-60" aria-hidden>
              ▾
            </span>
          ) : null}
        </a>

        <div className="pointer-events-none absolute left-1/2 top-full z-40 w-[200px] -translate-x-1/2 pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="rounded-sm bg-[#6B6D53] px-4 py-3 text-white shadow-xl">
            <div className="flex flex-col gap-3">
              {OUR_TEAM_DROPDOWN.map((member) => (
                <a
                  key={member.name}
                  href={member.href}
                  onClick={onNavigate}
                  className="text-[12px] leading-tight tracking-wide text-white transition hover:text-white/80"
                >
                  {member.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <a
      href={item.href}
      onClick={onNavigate}
      className={`inline-flex items-center gap-0.5 whitespace-nowrap ${navLinkClass}`}
    >
      <span>{item.label}</span>
      {showChevron ? (
        <span className="text-[0.6rem] leading-none opacity-60" aria-hidden>
          ▾
        </span>
      ) : null}
    </a>
  )
}

/**
 * Maeda-style header: olive utility bar, white bar with centered circular logo and split nav.
 */
export function SiteHeader({ isDark, onToggleTheme, showTopBar = true }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileMenuOpen])

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <>
      {showTopBar ? <TopBar isDark={isDark} onToggleTheme={onToggleTheme} /> : null}

      <header className="relative z-10 overflow-visible border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-[#343434]/95">
        <div className="container mx-auto overflow-visible px-3 sm:px-4">
          {/* Desktop: equal flex halves + logo absolutely centered on full bar (not grid midpoint) */}
          <div className="relative hidden min-h-[78px] pb-4 pt-2 lg:block">
            <div className="flex min-h-[64px] items-center">
              <div className="flex min-w-0 flex-1 items-center justify-end gap-x-4 pr-[min(7.5rem,11vw)] xl:gap-x-6 xl:pr-36 2xl:pr-40">
                <nav className="flex items-center justify-end gap-x-4 xl:gap-x-5">
                  {NAV_LEFT.map((item) => (
                    <NavLinkItem key={item.label} item={item} />
                  ))}
                </nav>
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-start gap-x-2 pl-[min(7.5rem,11vw)] xl:gap-x-3 xl:pl-36 2xl:pl-40">
                <nav className="flex items-center justify-start gap-x-4 xl:gap-x-5">
                  {NAV_RIGHT.map((item) => (
                    <NavLinkItem key={item.label} item={item} />
                  ))}
                </nav>
                <span className="hidden h-8 w-px shrink-0 bg-slate-200 lg:block dark:bg-slate-600" aria-hidden />
                <div className="flex shrink-0 flex-wrap items-center justify-start gap-1.5">
                <a
                    href="https://maedamedical.com/appointment/"
                    className="whitespace-nowrap rounded-full bg-[#63644A] px-3 py-4 text-[11px] font-normal uppercase tracking-wide text-white shadow-sm transition hover:scale-[1.02] xl:px-6"
                  >
                    Appointment
                  </a>
                  <a
                    href="/"
                    className="whitespace-nowrap rounded-full bg-[#63644A] px-3 py-4 text-[11px] font-normal uppercase tracking-wide text-white shadow-sm transition hover:scale-[1.02] xl:px-4 "
                  >
                    Health screening services
                  </a>
                </div>
              </div>
            </div>
            <a
              href="https://maedamedical.com/"
              className="pointer-events-auto absolute left-1/2 top-1/2 z-20 mt-1 flex -translate-x-1/2 -translate-y-1/2"
              aria-label="Maeda Medical Clinic home"
            >
              <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#63644A]/25 bg-white shadow-lg ring-4 ring-white dark:border-[#63644A]/40 dark:bg-[#2a2a2a] dark:ring-[#343434] xl:h-[86px] xl:w-[86px]">
                <img src={MMC_LOGO_URL} alt="" className="h-full w-full object-contain p-2" />
              </div>
            </a>
          </div>

          {/* Mobile / tablet: one compact bar + hamburger drawer */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between gap-3 py-2.5 pl-1 pr-2 sm:px-1">
              <a
                href="https://maedamedical.com/"
                className="flex min-w-0 flex-1 items-center gap-2.5"
                aria-label="Maeda Medical Clinic home"
                onClick={closeMobile}
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#63644A]/25 bg-white shadow-sm dark:bg-[#2a2a2a] sm:h-12 sm:w-12">
                  <img src={MMC_LOGO_URL} alt="" className="h-full w-full object-contain p-1" />
                </div>
                <span className="min-w-0 truncate text-[11px] font-normal uppercase leading-tight tracking-wide text-slate-900 dark:text-white sm:text-xs">
                  Maeda Medical Clinic
                </span>
              </a>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href="https://maedamedical.com/appointment/"
                  onClick={closeMobile}
                  className="rounded-full bg-[#63644A] px-3 py-2 text-[10px] font-normal uppercase tracking-wide text-white sm:px-4 sm:text-xs"
                >
                  Appointment
                </a>
                <button
                  type="button"
                  id="mobile-menu-button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 dark:border-slate-600 dark:bg-[#3f3f3f] dark:text-slate-100"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-nav-panel"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  onClick={() => setMobileMenuOpen((o) => !o)}
                >
                  {mobileMenuOpen ? <IconClose /> : <IconHamburger />}
                </button>
              </div>
            </div>

            {mobileMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                  aria-label="Close menu"
                  onClick={closeMobile}
                />
                <div
                  id="mobile-nav-panel"
                  className="relative z-50 border-t border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-[#2e2e2e]"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site menu"
                >
                  <nav className="flex max-h-[min(70vh,28rem)] flex-col overflow-y-auto px-4 py-2" aria-label="Primary">
                    {NAV_ITEMS.map((item) => {
                      const showChevron =
                        item.label === 'OUR SERVICES' || item.label === 'OUR TEAM'
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={closeMobile}
                          className="flex items-center justify-between border-b border-slate-100 py-3.5 text-sm font-normal uppercase tracking-wide text-slate-800 last:border-b-0 dark:border-slate-600 dark:text-slate-100"
                        >
                          <span>{item.label}</span>
                          {showChevron ? (
                            <span className="text-xs opacity-50" aria-hidden>
                              ▾
                            </span>
                          ) : null}
                        </a>
                      )
                    })}
                    <a
                      href="/"
                      onClick={closeMobile}
                      className="mt-2 rounded-full border-2 border-[#63644A] py-3 text-center text-xs font-normal uppercase tracking-wide text-[#63644A] dark:text-[#c4c5a8] dark:border-[#c4c5a8]"
                    >
                      Health screening services
                    </a>
                    <a
                      href="https://maedamedical.com/appointment/"
                      onClick={closeMobile}
                      className="mt-2 rounded-full bg-[#63644A] py-3 text-center text-xs font-normal uppercase tracking-wide text-white"
                    >
                      Appointment
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleTheme()
                      }}
                      className="mt-4 mb-2 rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-700 dark:border-slate-500 dark:text-slate-200"
                    >
                      {isDark ? 'Light mode' : 'Dark mode'}
                    </button>
                  </nav>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>
    </>
  )
}
