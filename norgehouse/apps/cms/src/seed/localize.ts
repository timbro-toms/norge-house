import type { Payload } from 'payload'

/* ─────────────────────── helpers ─────────────────────── */

const p = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const paragraphs = (...texts: string[]) => ({
  root: {
    type: 'root',
    children: texts.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    })),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

/* ─────────────────────── types ─────────────────────── */

interface PageTranslation {
  title: string
  hero?: {
    heading?: string
    subheading?: string
    ctaLabel?: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections?: any[]
}

type LocaleTranslations = Record<string, PageTranslation>

/* ─────────────────────── main ─────────────────────── */

export async function localize(payload: Payload): Promise<void> {
  console.log('Starting localization...')

  // ── Fix Site Settings ──
  console.log('Updating site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'Norge House SIA',
      phone: '+371 25774431',
      phoneSecondary: '+44 07926691478',
      email: 'info@norgehouse.com',
      address: 'Alejparks, Valmiermuiža, Valmiera, Latvija',
      vatNumber: 'LV40203079564',
      socialLinks: {
        facebook: 'https://www.facebook.com/norgehouse',
        instagram: 'https://www.instagram.com/norgehouse_/',
        linkedin: 'https://www.linkedin.com/company/norgehouse/',
        youtube: 'https://www.youtube.com/@norgehouse',
      },
    },
  })

  // ── Localize Pages ──
  const pageTranslations: Record<string, LocaleTranslations> = {
    home: {
      lv: {
        title: 'Sākums',
        hero: {
          heading: 'Energoefektīvas koka karkasa mājas',
          subheading: 'Ražotas Latvijā atbilstoši augstākajiem Skandināvu standartiem',
          ctaLabel: 'Skatīt projektus',
        },
      },
      de: {
        title: 'Home',
        hero: {
          heading: 'Energieeffiziente Holzrahmenhäuser',
          subheading: 'Hergestellt in Lettland nach höchsten skandinavischen Standards',
          ctaLabel: 'Projekte ansehen',
        },
      },
      it: {
        title: 'Home',
        hero: {
          heading: 'Case in legno ad alta efficienza energetica',
          subheading: 'Prodotte in Lettonia secondo i più alti standard scandinavi',
          ctaLabel: 'Vedi i progetti',
        },
      },
    },
    'about-us': {
      lv: {
        title: 'Par mums',
        hero: {
          heading: 'Par Norge House',
          subheading: 'Kvalitatīvas Skandināvu stila koka karkasa mājas, ražotas Latvijā',
        },
      },
      de: {
        title: 'Über uns',
        hero: {
          heading: 'Über Norge House',
          subheading: 'Hochwertige Holzrahmenhäuser im skandinavischen Stil, hergestellt in Lettland',
        },
      },
      it: {
        title: 'Chi siamo',
        hero: {
          heading: 'Chi è Norge House',
          subheading: 'Case in legno di qualità in stile scandinavo, prodotte in Lettonia',
        },
      },
    },
    'manufacturing-kit': {
      lv: {
        title: 'Ražošanas komplekts',
        hero: {
          heading: 'Ražošanas komplekts',
          subheading: 'Kas ietilpst Norge House ražošanas komplektā',
        },
      },
      de: {
        title: 'Fertigungspaket',
        hero: {
          heading: 'Fertigungspaket',
          subheading: 'Was im Norge House Fertigungspaket enthalten ist',
        },
      },
      it: {
        title: 'Kit di produzione',
        hero: {
          heading: 'Kit di produzione',
          subheading: 'Cosa è incluso nel kit di produzione Norge House',
        },
      },
    },
    'construction-stages': {
      lv: {
        title: 'Būvniecības etapi',
        hero: {
          heading: 'Būvniecības etapi',
          subheading: 'Soli pa solim caur Norge House būvniecības etapiem',
        },
      },
      de: {
        title: 'Bauphasen',
        hero: {
          heading: 'Bauphasen',
          subheading: 'Schritt für Schritt durch die Bauphasen eines Norge House',
        },
      },
      it: {
        title: 'Fasi di costruzione',
        hero: {
          heading: 'Fasi di costruzione',
          subheading: 'Passo dopo passo attraverso le fasi di costruzione di una Norge House',
        },
      },
    },
    units: {
      lv: {
        title: 'Mezgli',
        hero: {
          heading: 'Konstrukcijas mezgli',
          subheading: 'Detalizētas Norge House konstrukcijas mezglu specifikācijas',
        },
      },
      de: {
        title: 'Einheiten',
        hero: {
          heading: 'Konstruktionseinheiten',
          subheading: 'Detaillierte Spezifikationen der Norge House Konstruktionseinheiten',
        },
      },
      it: {
        title: 'Unità',
        hero: {
          heading: 'Unità costruttive',
          subheading: 'Specifiche dettagliate delle unità costruttive Norge House',
        },
      },
    },
    materials: {
      lv: {
        title: 'Materiāli',
        hero: {
          heading: 'Materiāli',
          subheading: 'Augstākās kvalitātes materiāli katrā Norge House',
        },
      },
      de: {
        title: 'Materialien',
        hero: {
          heading: 'Materialien',
          subheading: 'Hochwertige Materialien in jedem Norge House',
        },
      },
      it: {
        title: 'Materiali',
        hero: {
          heading: 'Materiali',
          subheading: 'Materiali di alta qualità in ogni Norge House',
        },
      },
    },
    montage: {
      lv: {
        title: 'Montāža',
        hero: {
          heading: 'Montāža un uzstādīšana',
          subheading: 'Profesionāla jūsu Norge House uzstādīšana',
        },
      },
      de: {
        title: 'Montage',
        hero: {
          heading: 'Montage und Aufbau',
          subheading: 'Professionelle Montage Ihres Norge House',
        },
      },
      it: {
        title: 'Montaggio',
        hero: {
          heading: 'Montaggio e assemblaggio',
          subheading: 'Assemblaggio professionale della vostra Norge House',
        },
      },
    },
    production: {
      lv: {
        title: 'Ražošana',
        hero: {
          heading: 'Ražošana',
          subheading: 'Moderna ražošanas bāze Latvijā',
        },
      },
      de: {
        title: 'Produktion',
        hero: {
          heading: 'Produktion',
          subheading: 'Moderne Produktionsanlage in Lettland',
        },
      },
      it: {
        title: 'Produzione',
        hero: {
          heading: 'Produzione',
          subheading: 'Impianto di produzione moderno in Lettonia',
        },
      },
    },
    b2b: {
      lv: {
        title: 'Partneriem',
        hero: {
          heading: 'B2B partnerība',
          subheading: 'Sadarbojieties ar mums augstas kvalitātes koka karkasa māju risinājumos',
        },
      },
      de: {
        title: 'B2B',
        hero: {
          heading: 'B2B-Partnerschaft',
          subheading: 'Partnern Sie mit uns für hochwertige Holzrahmenhaus-Lösungen',
        },
      },
      it: {
        title: 'B2B',
        hero: {
          heading: 'Partnership B2B',
          subheading: 'Collabora con noi per soluzioni di case prefabbricate in legno di alta qualità',
        },
      },
    },
    contacts: {
      lv: {
        title: 'Kontakti',
        hero: {
          heading: 'Sazinieties ar mums',
          subheading: 'Sazināties ar Norge House',
        },
      },
      de: {
        title: 'Kontakte',
        hero: {
          heading: 'Kontaktieren Sie uns',
          subheading: 'Nehmen Sie Kontakt mit Norge House auf',
        },
      },
      it: {
        title: 'Contatti',
        hero: {
          heading: 'Contattaci',
          subheading: 'Mettiti in contatto con Norge House',
        },
      },
    },
  }

  // Process each page
  for (const [slug, locales] of Object.entries(pageTranslations)) {
    // Find the page by slug
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      console.log(`  Page "${slug}" not found, skipping...`)
      continue
    }

    const pageId = result.docs[0].id

    for (const [locale, translation] of Object.entries(locales)) {
      await payload.update({
        collection: 'pages',
        id: pageId,
        locale,
        data: {
          title: translation.title,
          hero: translation.hero ? {
            heading: translation.hero.heading,
            subheading: translation.hero.subheading,
            ...(translation.hero.ctaLabel && { ctaLabel: translation.hero.ctaLabel }),
          } : undefined,
        },
      })
      console.log(`  Page "${slug}" → ${locale} ✓`)
    }
  }

  // ── Localize Projects ──
  console.log('Localizing projects...')

  // Project titles are the same across locales (House 70 = Māja 70 = Haus 70 = Casa 70)
  const projectTitlePrefixes: Record<string, string> = {
    en: 'House',
    lv: 'Māja',
    de: 'Haus',
    it: 'Casa',
  }

  const projectModulePrefixes: Record<string, string> = {
    en: 'House Module',
    lv: 'Māja Modulis',
    de: 'Haus Modul',
    it: 'Casa Modulo',
  }

  const projectSaunaPrefixes: Record<string, string> = {
    en: 'House Module Sauna',
    lv: 'Māja Modulis Pirts',
    de: 'Haus Modul Sauna',
    it: 'Casa Modulo Sauna',
  }

  const priceNoteTrans: Record<string, string> = {
    en: 'excl. VAT',
    lv: 'bez PVN',
    de: 'zzgl. MwSt.',
    it: 'IVA esclusa',
  }

  const allProjects = await payload.find({
    collection: 'projects',
    limit: 100,
  })

  for (const project of allProjects.docs) {
    const slug = (project as { slug: string }).slug
    const enTitle = (project as { title: string }).title

    for (const locale of ['lv', 'de', 'it']) {
      let localizedTitle = enTitle

      if (enTitle.startsWith('House Module Sauna')) {
        const num = enTitle.replace('House Module Sauna ', '')
        localizedTitle = `${projectSaunaPrefixes[locale]} ${num}`
      } else if (enTitle.startsWith('House Module')) {
        const num = enTitle.replace('House Module ', '')
        localizedTitle = `${projectModulePrefixes[locale]} ${num}`
      } else if (enTitle.startsWith('House ')) {
        const num = enTitle.replace('House ', '')
        localizedTitle = `${projectTitlePrefixes[locale]} ${num}`
      }

      const updateData: Record<string, unknown> = { title: localizedTitle }
      if ((project as { priceNote?: string }).priceNote) {
        updateData.priceNote = priceNoteTrans[locale]
      }

      await payload.update({
        collection: 'projects',
        id: project.id as string,
        locale,
        data: updateData,
      })
    }
    console.log(`  Project "${slug}" localized ✓`)
  }

  // ── Localize News Articles ──
  console.log('Localizing news articles...')

  const newsTranslations: Record<string, Record<string, { title: string; excerpt?: string }>> = {
    'norge-house-expands-production-facility': {
      lv: { title: 'Norge House paplašina ražotni', excerpt: 'Lai apmierinātu pieaugošo pieprasījumu visā Eiropā, Norge House ir paplašinājis savu koka karkasa māju ražotni Latvijā.' },
      de: { title: 'Norge House erweitert die Produktionsanlage', excerpt: 'Um die wachsende Nachfrage in ganz Europa zu decken, hat Norge House seine Produktionsanlage in Lettland erweitert.' },
      it: { title: 'Norge House amplia lo stabilimento', excerpt: 'Per soddisfare la crescente domanda in tutta Europa, Norge House ha ampliato il suo stabilimento di produzione in Lettonia.' },
    },
    'new-modular-house-line-launched': {
      lv: { title: 'Jaunā moduļu māju līnija', excerpt: 'Norge House piedāvā jaunu moduļu māju līniju — pilnībā rūpnīcā būvētas, transportējamas vienības no 22 m² līdz 54 m².' },
      de: { title: 'Neue Modulhaus-Linie eingeführt', excerpt: 'Norge House stellt eine neue Modulhaus-Linie vor — fabrikgefertigte, transportable Einheiten von 22 m² bis 54 m².' },
      it: { title: 'Nuova linea di case modulari', excerpt: 'Norge House introduce una nuova linea di case modulari — unità completamente costruite in fabbrica da 22 m² a 54 m².' },
    },
    'completely-finished-house-project': {
      lv: { title: 'Pilnībā pabeigts mājas projekts', excerpt: 'Norge House tagad piedāvā pilnībā pabeigtu moduļu māju ar kopējo platību 32.5 m², par cenu €66 000 + PVN.' },
      de: { title: 'Komplett fertiggestelltes Hausprojekt', excerpt: 'Norge House bietet jetzt ein komplett fertiggestelltes Modulhaus mit 32,5 m² Gesamtfläche zum Preis von 66.000 € + MwSt.' },
      it: { title: 'Progetto casa completamente finito', excerpt: 'Norge House offre ora una casa modulare completamente finita con superficie totale di 32,5 m², al prezzo di €66.000 + IVA.' },
    },
    'house-219-largest-two-storey-project': {
      lv: { title: 'Māja 219 — mūsu lielākais divstāvu projekts', excerpt: 'Iepazīstinām Māja 219 — plašu 169.8 m² divstāvu ģimenes māju ar iebūvētu garāžu.' },
      de: { title: 'Haus 219 — unser größtes zweistöckiges Projekt', excerpt: 'Wir stellen Haus 219 vor — ein geräumiges 169,8 m² zweistöckiges Familienhaus mit integrierter Garage.' },
      it: { title: 'Casa 219 — il nostro più grande progetto a due piani', excerpt: 'Vi presentiamo Casa 219 — una spaziosa casa familiare di 169,8 m² su due piani con garage integrato.' },
    },
    'successful-delivery-germany-house-127': {
      lv: { title: 'Veiksmīga piegāde uz Vāciju — Māja 127', excerpt: 'Norge House ir veiksmīgi saražojis un piegādājis Māju 127 klientam Vācijā. 126.5 m² vienstāvu māja tika uzstādīta tikai 4 darba dienās.' },
      de: { title: 'Erfolgreiche Lieferung nach Deutschland — Haus 127', excerpt: 'Norge House hat die Fertigung und Lieferung von Haus 127 an einen Kunden in Deutschland abgeschlossen.' },
      it: { title: 'Consegna riuscita in Germania — Casa 127', excerpt: 'Norge House ha completato la produzione e la consegna di Casa 127 per un cliente in Germania.' },
    },
    'norge-house-baltic-construction-exhibition-2025': {
      lv: { title: 'Norge House Baltijas būvniecības izstādē 2025', excerpt: 'Apmeklējiet Norge House Baltijas būvniecības izstādē Rīgā. Skatiet mūsu jaunākos risinājumus un satieciet komandu.' },
      de: { title: 'Norge House auf der Baltischen Baumesse 2025', excerpt: 'Besuchen Sie Norge House auf der Baltischen Baumesse in Riga. Sehen Sie unsere neuesten Lösungen.' },
      it: { title: 'Norge House alla Fiera Edilizia Baltica 2025', excerpt: 'Visitate Norge House alla Fiera Edilizia Baltica a Riga. Scoprite le nostre ultime soluzioni.' },
    },
    'new-payment-structure-flexible-financing': {
      lv: { title: 'Jauna maksājumu struktūra — elastīga finansēšana', excerpt: 'Norge House piedāvā pārskatāmu 3 posmu maksājumu plānu: 10% pie līguma parakstīšanas, 50% ražošanas laikā un 40% pēc piegādes.' },
      de: { title: 'Neue Zahlungsstruktur — flexible Finanzierung', excerpt: 'Norge House führt einen transparenten 3-Stufen-Zahlungsplan ein: 10% bei Vertragsunterzeichnung, 50% während der Fertigung und 40% bei Lieferung.' },
      it: { title: 'Nuova struttura di pagamento — finanziamento flessibile', excerpt: 'Norge House introduce un piano di pagamento trasparente in 3 fasi: 10% alla firma del contratto, 50% durante la produzione e 40% alla consegna.' },
    },
    'website-redesign-welcome-new-norgehouse': {
      lv: { title: 'Mājas lapas pārveidošana — laipni lūdzam jaunajā norgehouse.com', excerpt: 'Mēs esam atjaunojuši savu mājas lapu ar uzlabotu projektu pārlūkošanu un atjaunotu galeriju.' },
      de: { title: 'Website-Neugestaltung — Willkommen auf der neuen norgehouse.com', excerpt: 'Wir haben unsere Website mit verbesserter Projektansicht und aktualisierter Galerie neu gestaltet.' },
      it: { title: 'Redesign del sito — benvenuti sul nuovo norgehouse.com', excerpt: 'Abbiamo riprogettato il nostro sito con una migliore navigazione dei progetti e una galleria aggiornata.' },
    },
  }

  for (const [slug, locales] of Object.entries(newsTranslations)) {
    const result = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      console.log(`  Article "${slug}" not found, skipping...`)
      continue
    }

    const articleId = result.docs[0].id

    for (const [locale, translation] of Object.entries(locales)) {
      try {
        await payload.update({
          collection: 'news',
          id: articleId as string,
          locale,
          data: {
            title: translation.title,
            ...(translation.excerpt && { excerpt: translation.excerpt }),
          },
        })
      } catch (err) {
        console.log(`  Article "${slug}" → ${locale} FAILED: ${(err as Error).message}`)
      }
    }
    console.log(`  Article "${slug}" localized ✓`)
  }

  // ── Add missing projects from live site ──
  console.log('Adding missing projects...')

  const missingProjects = [
    {
      title: 'House 23',
      slug: 'house-23',
      areaSqm: 22.7,
      livingArea: 22.7,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 20430,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A compact 22.7 m² single-storey house. An excellent solution for a garden house, guest house, or small holiday home.'),
    },
    {
      title: 'House 45',
      slug: 'house-45',
      areaSqm: 45.71,
      livingArea: 45.71,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 41140,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A functional 45.71 m² single-storey house. Ideal as a compact family home or holiday residence.'),
    },
    {
      title: 'House 48',
      slug: 'house-48',
      areaSqm: 47.6,
      livingArea: 47.6,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 42840,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A comfortable 47.6 m² single-storey house with an efficient layout. Perfect as a starter home.'),
    },
    {
      title: 'House 54',
      slug: 'house-54',
      areaSqm: 54.3,
      livingArea: 54.3,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 48870,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A well-designed 54.3 m² single-storey house offering comfortable living space with a practical layout.'),
    },
    {
      title: 'House 63',
      slug: 'house-63',
      areaSqm: 63.6,
      livingArea: 60.1,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 54090,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A single-storey house with 60.1 m² of living area and a total area of 63.6 m². A great balance of space and affordability.'),
    },
    {
      title: 'House 77',
      slug: 'house-77',
      areaSqm: 76.9,
      livingArea: 76.9,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 69210,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A spacious 76.9 m² single-storey house with generous living areas and comfortable bedrooms.'),
    },
    {
      title: 'House 82',
      slug: 'house-82',
      areaSqm: 82.0,
      livingArea: 82.0,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 73800,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('An 82 m² single-storey house with a modern design. Provides ample living space for a comfortable family home.'),
    },
  ]

  for (const project of missingProjects) {
    // Check if exists first
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'projects',
        data: project as Record<string, unknown>,
      })

      // Localize the new project
      for (const locale of ['lv', 'de', 'it']) {
        const num = project.title.replace('House ', '')
        await payload.update({
          collection: 'projects',
          id: created.id as string,
          locale,
          data: {
            title: `${projectTitlePrefixes[locale]} ${num}`,
            priceNote: priceNoteTrans[locale],
          },
        })
      }
      console.log(`  Created + localized project "${project.slug}" ✓`)
    } else {
      console.log(`  Project "${project.slug}" already exists, skipping...`)
    }
  }

  console.log('\nLocalization complete!')
  console.log('  - Site settings updated with correct address/phone')
  console.log('  - 10 pages localized (LV, DE, IT)')
  console.log('  - All projects localized')
  console.log('  - 8 news articles localized')
  console.log('  - 7 missing projects added')
}
