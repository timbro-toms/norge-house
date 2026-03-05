'use client'

import { usePathname, useRouter } from 'next/navigation'

const localeLabels: Record<string, string> = {
  en: 'EN',
  lv: 'LV',
  de: 'DE',
  it: 'IT',
}

const allLocales = ['en', 'lv', 'de', 'it']

interface LocaleSwitcherProps {
  locale: string
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split('/')
    if (segments.length > 1 && allLocales.includes(segments[1])) {
      segments[1] = newLocale
    }
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1">
      {allLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
            loc === locale
              ? 'bg-brand-primary text-brand-dark'
              : 'text-white/60 hover:text-white'
          }`}
          aria-label={`Switch to ${loc}`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  )
}
