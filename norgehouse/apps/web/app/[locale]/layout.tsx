import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Montserrat, Open_Sans } from 'next/font/google'
import { getNavigation, getSiteSettings } from '@/lib/payload'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/layout/CookieBanner'
import '../globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

const locales = ['en', 'lv', 'de', 'it']

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://norgehouse.com'),
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) {
    notFound()
  }

  const [messages, navigation, settings] = await Promise.all([
    getMessages(),
    getNavigation(locale),
    getSiteSettings(locale),
  ])

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.companyName || 'Norge House SIA',
    url: 'https://norgehouse.com',
    logo: 'https://norgehouse.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings?.phone,
      email: settings?.email,
      contactType: 'customer service',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cēsis',
      addressCountry: 'LV',
      streetAddress: settings?.address,
    },
    sameAs: [
      settings?.socialLinks?.facebook,
      settings?.socialLinks?.instagram,
      settings?.socialLinks?.linkedin,
      settings?.socialLinks?.youtube,
    ].filter(Boolean),
  }

  return (
    <html lang={locale} className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} navigation={navigation} settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} settings={settings} navigation={navigation} />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
