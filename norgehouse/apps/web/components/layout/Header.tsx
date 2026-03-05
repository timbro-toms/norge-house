'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Navigation, SiteSettings } from '@/lib/payload'
import { LocaleSwitcher } from './LocaleSwitcher'

interface HeaderProps {
  locale: string
  navigation: Navigation | null
  settings: SiteSettings | null
}

export function Header({ locale, navigation, settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-dark shadow-lg'
            : 'bg-brand-dark/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-page flex items-center justify-between h-16 md:h-20">
          <Link href={`/${locale}/home`} className="flex items-center gap-2">
            <span className="font-heading font-bold text-xl text-white">
              {settings?.companyName || 'Norge House'}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation?.items.map((item, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => item.children?.length ? setOpenDropdown(idx) : undefined}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm text-white/90 hover:text-brand-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && openDropdown === idx && (
                  <div className="absolute top-full left-0 bg-brand-dark border border-white/10 rounded-lg shadow-xl py-2 min-w-[200px]">
                    {item.children.map((child, childIdx) => (
                      <Link
                        key={childIdx}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-white/80 hover:text-brand-primary hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LocaleSwitcher locale={locale} />

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark lg:hidden">
          <div className="pt-20 px-6 pb-6 overflow-y-auto h-full">
            <nav className="space-y-1">
              {navigation?.items.map((item, idx) => (
                <div key={idx}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block py-3 text-lg text-white font-heading font-semibold hover:text-brand-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child, childIdx) => (
                    <Link
                      key={childIdx}
                      href={child.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block py-2 pl-4 text-white/70 hover:text-brand-primary transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  )
}
