import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildHreflangAlternates(
  slug: string,
  slugTranslations?: Record<string, string>,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://norgehouse.com'
  const locales = ['en', 'lv', 'de', 'it']

  const alternates: Record<string, string> = {
    'x-default': `${siteUrl}/en/${slug}/`,
  }

  for (const locale of locales) {
    const localizedSlug = slugTranslations?.[locale] || slug
    alternates[locale] = `${siteUrl}/${locale}/${localizedSlug}/`
  }

  return alternates
}

export function getMediaUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || ''
  return `${payloadUrl}${url}`
}
