import type { Payload } from 'payload'
import { randomBytes } from 'crypto'

export const seed = async (payload: Payload): Promise<void> => {
  const password = randomBytes(16).toString('hex')

  // Create admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@norgehouse.com',
      password,
    },
  })

  console.log('========================================')
  console.log('Admin user created:')
  console.log(`  Email:    admin@norgehouse.com`)
  console.log(`  Password: ${password}`)
  console.log('  SAVE THIS PASSWORD — it will not be shown again.')
  console.log('========================================')

  // Seed navigation for all locales
  const navData: Record<string, { label: string; href: string; children?: { label: string; href: string }[] }[]> = {
    en: [
      { label: 'Home', href: '/en/home' },
      {
        label: 'About Us',
        href: '/en/about-us',
        children: [
          { label: 'Manufacturing Kit', href: '/en/about-us/manufacturing-kit' },
          { label: 'Construction Stages', href: '/en/about-us/construction-stages' },
          { label: 'Units', href: '/en/about-us/units' },
          { label: 'Materials', href: '/en/about-us/materials' },
          { label: 'Montage', href: '/en/about-us/montage' },
        ],
      },
      { label: 'Production', href: '/en/production' },
      { label: 'Projects', href: '/en/projects' },
      { label: 'Galleries', href: '/en/galleries' },
      { label: 'B2B', href: '/en/b2b' },
      { label: 'News', href: '/en/news' },
      { label: 'Contacts', href: '/en/contacts' },
    ],
    lv: [
      { label: 'Sākums', href: '/lv/sakums' },
      {
        label: 'Par mums',
        href: '/lv/par-mums',
        children: [
          { label: 'Ražošanas komplekts', href: '/lv/parmums/razosanas-komplekts' },
          { label: 'Būvniecības etapi', href: '/lv/parmums/buvniecibas-etapi' },
          { label: 'Mezgli', href: '/lv/parmums/mezgli' },
          { label: 'Materiāli', href: '/lv/parmums/materiali' },
          { label: 'Montāža', href: '/lv/parmums/montaza' },
        ],
      },
      { label: 'Ražošana', href: '/lv/razosana' },
      { label: 'Projekti', href: '/lv/projekti' },
      { label: 'Galerijas', href: '/lv/galerijas' },
      { label: 'Partneriem', href: '/lv/partneriem' },
      { label: 'Jaunumi', href: '/lv/jaunumi' },
      { label: 'Kontakti', href: '/lv/kontakti' },
    ],
    de: [
      { label: 'Home', href: '/de/home' },
      {
        label: 'Über uns',
        href: '/de/uberuns',
        children: [
          { label: 'Fertigungspaket', href: '/de/about-us/manufacturing-kit' },
          { label: 'Bauphasen', href: '/de/about-us/construction-stages' },
          { label: 'Einheiten', href: '/de/about-us/units' },
          { label: 'Materialien', href: '/de/about-us/materials' },
          { label: 'Montage', href: '/de/about-us/montage' },
        ],
      },
      { label: 'Produktion', href: '/de/produktion' },
      { label: 'Projekte', href: '/de/projekte' },
      { label: 'Galerie', href: '/de/galerie' },
      { label: 'B2B', href: '/de/b2b' },
      { label: 'Neuigkeiten', href: '/de/neuigkeiten' },
      { label: 'Kontakte', href: '/de/kontakte' },
    ],
    it: [
      { label: 'Home', href: '/it/home' },
      {
        label: 'Chi siamo',
        href: '/it/chi-siamo',
        children: [
          { label: 'Kit di produzione', href: '/it/about-us/manufacturing-kit' },
          { label: 'Fasi di costruzione', href: '/it/about-us/construction-stages' },
          { label: 'Unità', href: '/it/about-us/units' },
          { label: 'Materiali', href: '/it/about-us/materials' },
          { label: 'Montaggio', href: '/it/about-us/montage' },
        ],
      },
      { label: 'Produzione', href: '/it/Produzione' },
      { label: 'Progetti', href: '/it/progetti' },
      { label: 'Galleria', href: '/it/galleria' },
      { label: 'B2B', href: '/it/b2b' },
      { label: 'Notizie', href: '/it/notizie' },
      { label: 'Contatti', href: '/it/contatti' },
    ],
  }

  for (const [locale, items] of Object.entries(navData)) {
    await payload.create({
      collection: 'navigation',
      data: {
        locale,
        items,
      },
    })
  }

  // Seed site settings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'Norge House SIA',
      phone: '+371 26 364 446',
      email: 'info@norgehouse.com',
      address: 'Gaujas iela 29, Cēsis, LV-4101, Latvia',
      socialLinks: {
        facebook: 'https://www.facebook.com/norgehouse',
        instagram: 'https://www.instagram.com/norgehouse',
      },
    },
  })

  console.log('Seed completed: Navigation (4 locales) + Site Settings created.')
}
