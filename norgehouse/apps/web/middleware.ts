import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, pathnames } from './lib/i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|media|favicon.ico|robots.txt|sitemap.xml).*)'],
}
