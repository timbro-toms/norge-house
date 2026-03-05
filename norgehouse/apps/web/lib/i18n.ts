import { Pathnames } from 'next-intl/navigation'

export const locales = ['en', 'lv', 'de', 'it'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const pathnames = {
  '/home': {
    en: '/home',
    lv: '/sakums',
    de: '/home',
    it: '/home',
  },
  '/about-us': {
    en: '/about-us',
    lv: '/par-mums',
    de: '/uberuns',
    it: '/chi-siamo',
  },
  '/about-us/manufacturing-kit': {
    en: '/about-us/manufacturing-kit',
    lv: '/parmums/razosanas-komplekts',
    de: '/about-us/manufacturing-kit',
    it: '/about-us/manufacturing-kit',
  },
  '/about-us/construction-stages': {
    en: '/about-us/construction-stages',
    lv: '/parmums/buvniecibas-etapi',
    de: '/about-us/construction-stages',
    it: '/about-us/construction-stages',
  },
  '/about-us/units': {
    en: '/about-us/units',
    lv: '/parmums/mezgli',
    de: '/about-us/units',
    it: '/about-us/units',
  },
  '/about-us/materials': {
    en: '/about-us/materials',
    lv: '/parmums/materiali',
    de: '/about-us/materials',
    it: '/about-us/materials',
  },
  '/about-us/montage': {
    en: '/about-us/montage',
    lv: '/parmums/montaza',
    de: '/about-us/montage',
    it: '/about-us/montage',
  },
  '/production': {
    en: '/production',
    lv: '/razosana',
    de: '/produktion',
    it: '/Produzione',
  },
  '/projects': {
    en: '/projects',
    lv: '/projekti',
    de: '/projekte',
    it: '/progetti',
  },
  '/projects/[slug]': {
    en: '/projects/[slug]',
    lv: '/projekti/[slug]',
    de: '/projekte/[slug]',
    it: '/progetti/[slug]',
  },
  '/galleries': {
    en: '/galleries',
    lv: '/galerijas',
    de: '/galerie',
    it: '/galleria',
  },
  '/b2b': {
    en: '/b2b',
    lv: '/partneriem',
    de: '/b2b',
    it: '/b2b',
  },
  '/news': {
    en: '/news',
    lv: '/jaunumi',
    de: '/neuigkeiten',
    it: '/notizie',
  },
  '/news/[slug]': {
    en: '/news/[slug]',
    lv: '/jaunumi/[slug]',
    de: '/neuigkeiten/[slug]',
    it: '/notizie/[slug]',
  },
  '/contacts': {
    en: '/contacts',
    lv: '/kontakti',
    de: '/kontakte',
    it: '/contatti',
  },
  '/contacts/privacy-policy': {
    en: '/contacts/privacy-policy',
    lv: '/kontakti/privatuma-politika',
    de: '/contacts/privacy-policy',
    it: '/contacts/privacy-policy',
  },
  '/contacts/terms': {
    en: '/contacts/norge-house-terms-of-service',
    lv: '/kontakti/noteikumi',
    de: '/contacts/norge-house-terms-of-service',
    it: '/contacts/norge-house-terms-of-service',
  },
} satisfies Pathnames<typeof locales>
