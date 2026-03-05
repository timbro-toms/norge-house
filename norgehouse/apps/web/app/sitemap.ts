import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://norgehouse.com'
const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'

const locales = ['en', 'lv', 'de', 'it']

// Static page slugs per locale
const staticPages: Record<string, Record<string, string>> = {
  home: { en: 'home', lv: 'sakums', de: 'home', it: 'home' },
  'about-us': { en: 'about-us', lv: 'par-mums', de: 'uberuns', it: 'chi-siamo' },
  'about-us/manufacturing-kit': { en: 'about-us/manufacturing-kit', lv: 'parmums/razosanas-komplekts', de: 'about-us/manufacturing-kit', it: 'about-us/manufacturing-kit' },
  'about-us/construction-stages': { en: 'about-us/construction-stages', lv: 'parmums/buvniecibas-etapi', de: 'about-us/construction-stages', it: 'about-us/construction-stages' },
  'about-us/units': { en: 'about-us/units', lv: 'parmums/mezgli', de: 'about-us/units', it: 'about-us/units' },
  'about-us/materials': { en: 'about-us/materials', lv: 'parmums/materiali', de: 'about-us/materials', it: 'about-us/materials' },
  'about-us/montage': { en: 'about-us/montage', lv: 'parmums/montaza', de: 'about-us/montage', it: 'about-us/montage' },
  production: { en: 'production', lv: 'razosana', de: 'produktion', it: 'Produzione' },
  projects: { en: 'projects', lv: 'projekti', de: 'projekte', it: 'progetti' },
  galleries: { en: 'galleries', lv: 'galerijas', de: 'galerie', it: 'galleria' },
  b2b: { en: 'b2b', lv: 'partneriem', de: 'b2b', it: 'b2b' },
  news: { en: 'news', lv: 'jaunumi', de: 'neuigkeiten', it: 'notizie' },
  contacts: { en: 'contacts', lv: 'kontakti', de: 'kontakte', it: 'contatti' },
  'contacts/privacy-policy': { en: 'contacts/privacy-policy', lv: 'kontakti/privatuma-politika', de: 'contacts/privacy-policy', it: 'contacts/privacy-policy' },
  'contacts/terms': { en: 'contacts/norge-house-terms-of-service', lv: 'kontakti/noteikumi', de: 'contacts/norge-house-terms-of-service', it: 'contacts/norge-house-terms-of-service' },
}

async function fetchSlugs(collection: string): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/${collection}?limit=1000&depth=0`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const [key, slugs] of Object.entries(staticPages)) {
    const priority = key === 'home' ? 1.0 : key.includes('/') ? 0.6 : 0.8
    const changeFrequency = key === 'home' ? 'weekly' : key === 'news' ? 'daily' : 'monthly'

    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${slugs[locale]}/`,
        lastModified: new Date(),
        changeFrequency,
        priority,
      })
    }
  }

  // Dynamic project pages
  const projects = await fetchSlugs('projects')
  const projectSlugs: Record<string, string> = { en: 'projects', lv: 'projekti', de: 'projekte', it: 'progetti' }
  for (const project of projects) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${projectSlugs[locale]}/${project.slug}/`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  }

  // Dynamic news pages
  const articles = await fetchSlugs('news')
  const newsSlugs: Record<string, string> = { en: 'news', lv: 'jaunumi', de: 'neuigkeiten', it: 'notizie' }
  for (const article of articles) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${newsSlugs[locale]}/${article.slug}/`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  }

  return entries
}
