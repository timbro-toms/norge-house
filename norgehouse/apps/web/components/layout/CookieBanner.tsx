'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

const COOKIE_CONSENT_KEY = 'norgehouse_cookie_consent'

export function CookieBanner() {
  const t = useTranslations('cookie')
  const locale = useLocale()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_KEY)
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set(COOKIE_CONSENT_KEY, 'accepted', { expires: 365 })
    setIsVisible(false)
  }

  const handleDecline = () => {
    Cookies.set(COOKIE_CONSENT_KEY, 'declined', { expires: 365 })
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-dark border-t border-white/10 p-4 md:p-6">
      <div className="container-page flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/80 text-sm">
          {t('message')}{' '}
          <Link href={`/${locale}/contacts/privacy-policy`} className="text-brand-primary hover:underline">
            {t('learnMore')}
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-white/70 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            {t('decline')}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-brand-primary text-brand-dark font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
