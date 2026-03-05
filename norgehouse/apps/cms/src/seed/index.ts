import type { Payload } from 'payload'
import { randomBytes } from 'crypto'

/* ─────────────────────── helpers ─────────────────────── */

/** Lexical rich-text paragraph helper */
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

/** Multi-paragraph rich text */
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

/* ─────────────────────── seed ─────────────────────── */

export const seed = async (payload: Payload): Promise<void> => {
  const password = randomBytes(16).toString('hex')

  // ── Admin user ──
  await payload.create({
    collection: 'users',
    data: { email: 'admin@norgehouse.com', password },
  })

  console.log('========================================')
  console.log('Admin user created:')
  console.log(`  Email:    admin@norgehouse.com`)
  console.log(`  Password: ${password}`)
  console.log('  SAVE THIS PASSWORD — it will not be shown again.')
  console.log('========================================')

  // ── Navigation ──
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
          { label: 'Fertigungspaket', href: '/de/uberuns/fertigungspaket' },
          { label: 'Bauphasen', href: '/de/uberuns/bauphasen' },
          { label: 'Einheiten', href: '/de/uberuns/einheiten' },
          { label: 'Materialien', href: '/de/uberuns/materialien' },
          { label: 'Montage', href: '/de/uberuns/montage' },
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
          { label: 'Kit di produzione', href: '/it/chi-siamo/kit-produzione' },
          { label: 'Fasi di costruzione', href: '/it/chi-siamo/fasi-costruzione' },
          { label: 'Unità', href: '/it/chi-siamo/unita' },
          { label: 'Materiali', href: '/it/chi-siamo/materiali' },
          { label: 'Montaggio', href: '/it/chi-siamo/montaggio' },
        ],
      },
      { label: 'Produzione', href: '/it/produzione' },
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
      data: { locale, items },
    })
  }

  // ── Site Settings ──
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'Norge House SIA',
      phone: '+371 25 901 010',
      phoneSecondary: '+371 20 35 22 88',
      email: 'info@norgehouse.com',
      address: 'Sū iela 10, Mārupe, LV-2166, Latvia',
      socialLinks: {
        facebook: 'https://www.facebook.com/norgehouse',
        instagram: 'https://www.instagram.com/norgehouse',
      },
    },
  })

  // ═══════════════════════════════════════════════════════
  // PAGES — real content from norgehouse.com
  // ═══════════════════════════════════════════════════════

  // ── HOME PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      status: 'published',
      hero: {
        heading: 'Energy Efficient Timber Frame Houses',
        subheading: 'Manufactured in Latvia according to highest Scandinavian standards',
        ctaLabel: 'View Projects',
        ctaHref: '/en/projects',
        variant: 'fullscreen',
      },
      sections: [
        // Stats section
        {
          blockType: 'stats',
          heading: 'Norge House in Numbers',
          stats: [
            { value: 200, label: 'Houses Built', suffix: '+' },
            { value: 10, label: 'Years of Experience', suffix: '+' },
            { value: 4, label: 'Countries', suffix: '' },
            { value: 100, label: 'Satisfied Clients', suffix: '%' },
          ],
        },
        // About teaser
        {
          blockType: 'textImage',
          heading: 'Quality Scandinavian-Style Timber Frame Houses',
          body: paragraphs(
            'Norge House manufactures and installs high-quality timber frame houses according to the standards and technology developed in cooperation with partner companies from Scandinavia.',
            'By taking over years of experience, technology and quality control of our Scandinavian collaborators, we offer our customers a quality product manufactured in Latvia at an attractive price.',
          ),
          imagePosition: 'right',
          ctaLabel: 'About Us',
          ctaHref: '/en/about-us',
        },
        // Feature grid — Why Choose Us
        {
          blockType: 'featureGrid',
          heading: 'Why Choose Norge House?',
          columns: '3',
          items: [
            {
              icon: 'energy',
              title: 'Energy Efficient',
              body: 'Our houses are built to the highest energy efficiency standards with triple-glazed windows and superior insulation (U=0.13 W/m²K walls).',
            },
            {
              icon: 'quality',
              title: 'Scandinavian Quality',
              body: 'All construction units are in line with modern, time-tested Scandinavian and European standards used worldwide.',
            },
            {
              icon: 'speed',
              title: 'Fast Construction',
              body: 'Manufacturing kit installation takes 5-10 days. A fully finished house can be completed in 6 months from start of production.',
            },
            {
              icon: 'custom',
              title: 'Custom Design',
              body: 'Our cooperation partners in project design are world-renowned companies who customize projects according to customer wishes.',
            },
            {
              icon: 'warranty',
              title: '10-Year Warranty',
              body: 'Every manufacturing kit comes with a 10-year warranty, giving you confidence in the durability of your investment.',
            },
            {
              icon: 'price',
              title: 'Attractive Pricing',
              body: 'High-quality houses manufactured in Latvia, offering Scandinavian standards at competitive European pricing.',
            },
          ],
        },
        // Projects teaser
        {
          blockType: 'projectsTeaser',
          heading: 'Our Projects',
          count: '6',
          filterFeatured: true,
        },
        // CTA Banner
        {
          blockType: 'ctaBanner',
          heading: 'Ready to Build Your Dream Home?',
          subheading: 'Contact us for a free consultation and quote',
          ctaLabel: 'Get in Touch',
          ctaHref: '/en/contacts',
          variant: 'image-overlay',
        },
        // News teaser
        {
          blockType: 'newsTeaser',
          heading: 'Latest News',
          count: '3',
        },
      ],
    },
  })

  // ── ABOUT US PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About Us',
      slug: 'about-us',
      status: 'published',
      hero: {
        heading: 'About Norge House',
        subheading: 'Quality Scandinavian-style timber-frame houses, manufactured in Latvia',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'textImage',
          heading: 'Our Story',
          body: paragraphs(
            'The company\'s operational direction is timber frame house production and assembly. Norge House manufactures and installs high quality timber frame houses according to high standards and technology developed by the concern, whose plant has been operating in Norway for many years.',
            'The Norge House brand has been developed in collaboration with partner companies from Scandinavia and gaining knowledge of timber frame structures from them. By taking over the years of experience, technology and quality control of these collaborators, Norge House has been able to offer its customers a quality product that is manufactured in Latvia.',
            'So far, Norge House has been cooperating with companies from Norway, but due to high demand it started manufacturing in Latvia and is developing trade routes in Europe offering high quality and attractive prices.',
          ),
          imagePosition: 'right',
        },
        {
          blockType: 'featureGrid',
          heading: 'Our Standards',
          columns: '3',
          items: [
            {
              icon: 'certificate',
              title: 'Certified Quality',
              body: 'The quality of production is confirmed by all necessary internationally recognized material quality certificates.',
            },
            {
              icon: 'technology',
              title: 'Modern Technology',
              body: 'The use of up-to-date technology in the manufacturing process ensures quality, durability and energy efficiency.',
            },
            {
              icon: 'design',
              title: 'Expert Design',
              body: 'Our cooperation partners in project design are world-renowned design companies, offering finished projects and custom designs.',
            },
          ],
        },
        {
          blockType: 'richText',
          content: paragraphs(
            'All of the construction units manufactured by Norge House are in line with modern, quality and throughout the time tested Scandinavian and European standards, which by default are used to build timber frame buildings around the world.',
            'Norge House is a progressive company that uses knowledge acquired over the years to improve its design technology, which is already a step ahead of similar offers.',
          ),
        },
        {
          blockType: 'stats',
          stats: [
            { value: 2014, label: 'Founded', prefix: '' },
            { value: 50, label: 'Team Members', suffix: '+' },
            { value: 200, label: 'Houses Delivered', suffix: '+' },
            { value: 10, label: 'Year Warranty', suffix: '' },
          ],
        },
        {
          blockType: 'ctaBanner',
          heading: 'Want to Learn More?',
          subheading: 'Explore our manufacturing process and materials',
          ctaLabel: 'View Production',
          ctaHref: '/en/production',
          variant: 'solid',
        },
      ],
    },
  })

  // ── MANUFACTURING KIT PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Manufacturing Kit',
      slug: 'manufacturing-kit',
      status: 'published',
      hero: {
        heading: 'Manufacturing Kit',
        subheading: 'What is included in the Norge House manufacturing kit',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'richText',
          content: paragraphs(
            'The Norge House manufacturing kit is a comprehensive package that includes all the structural and envelope components needed for your timber frame house. Each kit is precision-manufactured in our facility in Latvia and delivered ready for assembly.',
          ),
        },
        {
          blockType: 'featureGrid',
          heading: "What's Included",
          columns: '2',
          items: [
            {
              icon: 'walls',
              title: 'Exterior Walls',
              body: 'Structural timber frame (C24, 45×195mm), OSB board, vapour barrier, 200mm rock wool heat insulation, diffusion membrane, ventilation laths, wood fiber plate (50mm), wooden lath. U = 0.13 W/m²K. Wall height 2500mm.',
            },
            {
              icon: 'roof',
              title: 'Roof Structure',
              body: 'Roof trusses calculated for snow load of 5KN/m² with OSB roof base. Thermal performance U = 0.18 W/m². Roof angle and trusses according to structural calculations and project specifications.',
            },
            {
              icon: 'windows',
              title: 'Windows & Doors',
              body: 'PVC windows and patio doors with double selective package and five-chamber PVC frame. Thermal performance Uw ≈ 0.50 W/m²K. Available in white or optional colours.',
            },
            {
              icon: 'interior',
              title: 'Interior Walls',
              body: 'Interior wall structure with plasterboard. All interior partitions as per the floor plan design.',
            },
            {
              icon: 'facade',
              title: 'Façade Cladding',
              body: 'External wooden façade cladding and insulation. Options include Pine, Canexel, or STEICO WALL PROTECT.',
            },
            {
              icon: 'design',
              title: 'Architecture Services',
              body: 'Project selection and adaptation to customer needs. Architectural designs provided by Z500 and other partner design companies.',
            },
          ],
        },
        {
          blockType: 'accordion',
          heading: 'Frequently Asked Questions',
          items: [
            {
              question: 'What is NOT included in the manufacturing kit?',
              answer: p('The manufacturing kit does not include: foundation works, scaffolding, crane/unloading & assembly on-site, roof finish materials (covering, insulation & drainage), exterior/interior finishing, transport logistics to difficult sites, and waste disposal. However, full packages are available that add: roof covering with drain systems, interior finishing, veneered doors, vinyl or oak/ash flooring, engineering networks (water, sewerage, electricity), heating pump with heated floors, sanitary facilities, kitchen furniture, and built-in wardrobes.'),
            },
            {
              question: 'How long does installation take?',
              answer: p('The manufacturing kit installation takes 5-10 days. A fully finished house can be completed in approximately 6 months from the beginning of production.'),
            },
            {
              question: 'What warranty is provided?',
              answer: p('Every manufacturing kit comes with a 10-year warranty covering all structural components and materials.'),
            },
            {
              question: 'Can the design be customized?',
              answer: p('Yes, the house can be adapted to suit the needs of the customer. Our design partners offer both ready-made projects and full customization according to your wishes.'),
            },
          ],
        },
      ],
    },
  })

  // ── CONSTRUCTION STAGES PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Construction Stages',
      slug: 'construction-stages',
      status: 'published',
      hero: {
        heading: 'Construction Stages',
        subheading: 'Step-by-step guide through the construction stages of a Norge House',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'stepProcess',
          heading: 'From Design to Move-In',
          variant: 'numbered',
          steps: [
            {
              number: 1,
              title: 'Payment & Contract',
              body: 'At the signing of the contract, 10% of the total amount is paid. The second payment is 50% of the total price. The remaining 40% is paid once the construction kit is completed, delivered to the site, and assembled.',
            },
            {
              number: 2,
              title: 'Design & Planning',
              body: 'Topographic measurements of the land are required first, and then the architect begins developing the technical project according to your wishes.',
            },
            {
              number: 3,
              title: 'Construction at Facility',
              body: 'The building is manufactured at the Norge House production facility in Latvia. All wall panels, roof trusses, windows, and components are precision-built.',
            },
            {
              number: 4,
              title: 'Delivery & Assembly',
              body: 'Once the foundation is ready, the construction kit is loaded onto a truck and delivered to the building site. Assembly takes from 2 to 7 working days, depending on the size and specifics of the project.',
            },
            {
              number: 5,
              title: 'Weather-Tight Shell',
              body: 'Once installation is complete, you receive a near-finished house with walls, windows, and roof construction covered by an insulating membrane that prevents rain or snow from entering the building.',
            },
            {
              number: 6,
              title: 'Roof Covering',
              body: 'Choose the roof covering to install, which can be done immediately when the building is constructed at the facility, or in parallel with assembly work on-site.',
            },
            {
              number: 7,
              title: 'Network Installation',
              body: 'Complete installation of all networks: electrical (if not already installed during construction), water and sewage, and heating system.',
            },
            {
              number: 8,
              title: 'Finishing Work',
              body: 'When all networks are installed, finishing work begins. The customisation of each house is important, both in terms of materials and design. Norge House can recommend partners for interior design and finishing.',
            },
          ],
        },
        {
          blockType: 'ctaBanner',
          heading: 'Ready to Start Your Project?',
          subheading: 'Contact us for a detailed timeline and quote',
          ctaLabel: 'Contact Us',
          ctaHref: '/en/contacts',
          variant: 'solid',
        },
      ],
    },
  })

  // ── UNITS PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Units',
      slug: 'units',
      status: 'published',
      hero: {
        heading: 'Construction Units',
        subheading: 'Detailed specifications of Norge House construction units',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'richText',
          content: paragraphs(
            'All of the construction units manufactured by Norge House are in line with modern, quality and throughout the time tested Scandinavian and European standards, which by default are used to build timber frame buildings around the world.',
            'Below you will find detailed technical specifications for each construction unit that makes up a Norge House timber frame structure.',
          ),
        },
        {
          blockType: 'featureGrid',
          heading: 'Wall Units',
          columns: '2',
          items: [
            {
              icon: 'wall-ext',
              title: 'Exterior Wall Unit',
              body: 'Structural timber frame 45×195mm, ROCKWOOL insulation 195mm, OSB board 12mm, vapour barrier, wind protection board, ventilation gap 25mm, wooden façade cladding. U-value: 0.13 W/m²K.',
            },
            {
              icon: 'wall-int',
              title: 'Interior Wall Unit',
              body: 'Structural timber frame 45×95mm, ROCKWOOL insulation 50mm (for sound), plasterboard 12.5mm on both sides. Provides excellent sound insulation between rooms.',
            },
          ],
        },
        {
          blockType: 'featureGrid',
          heading: 'Roof & Floor Units',
          columns: '2',
          items: [
            {
              icon: 'roof',
              title: 'Roof Unit',
              body: 'Factory-manufactured roof trusses, calculated for snow load 5KN/m². OSB roof base 18mm, vapour barrier, insulation space for 300mm mineral wool. U-value: 0.18 W/m²K.',
            },
            {
              icon: 'floor',
              title: 'Floor Unit',
              body: 'Structural timber joists, OSB flooring board 22mm, insulation space, vapour barrier. Designed for residential floor loads.',
            },
          ],
        },
      ],
    },
  })

  // ── MATERIALS PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Materials',
      slug: 'materials',
      status: 'published',
      hero: {
        heading: 'Materials',
        subheading: 'Premium materials used in every Norge House',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'richText',
          content: paragraphs(
            'The quality of production is confirmed by all necessary internationally recognized material quality certificates. We use only premium-grade materials from trusted European suppliers.',
          ),
        },
        {
          blockType: 'featureGrid',
          heading: 'Key Materials',
          columns: '3',
          items: [
            {
              icon: 'timber',
              title: 'Structural Timber',
              body: 'Kiln-dried, strength-graded C24 structural timber from sustainably managed Nordic forests.',
            },
            {
              icon: 'insulation',
              title: 'ROCKWOOL Insulation',
              body: 'ROCKWOOL SUPERROCK stone wool insulation providing superior thermal and acoustic performance.',
            },
            {
              icon: 'windows',
              title: 'Triple-Glazed Windows',
              body: 'Triple-glazed PVC windows with Uw ≈ 0.50 W/m²K. Available in white or optional colours.',
            },
            {
              icon: 'osb',
              title: 'OSB Boards',
              body: 'Oriented strand board (OSB/3) for structural sheathing, roof base, and flooring — moisture resistant and load-bearing.',
            },
            {
              icon: 'facade',
              title: 'Façade Cladding',
              body: 'Choice of Pine wood, Canexel composite, or STEICO WALL PROTECT for long-lasting, beautiful exteriors.',
            },
            {
              icon: 'vapour',
              title: 'Vapour & Wind Barriers',
              body: 'High-quality vapour barriers and wind protection membranes ensuring airtightness and moisture management.',
            },
          ],
        },
      ],
    },
  })

  // ── MONTAGE PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Montage',
      slug: 'montage',
      status: 'published',
      hero: {
        heading: 'Montage & Assembly',
        subheading: 'Professional assembly of your Norge House',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'richText',
          content: paragraphs(
            'Norge House offers professional assembly services for all our manufacturing kits. Our experienced teams ensure your house is erected quickly and to the highest quality standards.',
            'The length of installation for a manufacturing kit takes from 5-10 working days, depending on the size and complexity of the project.',
          ),
        },
        {
          blockType: 'stepProcess',
          heading: 'Assembly Process',
          variant: 'horizontal',
          steps: [
            {
              number: 1,
              title: 'Site Preparation',
              body: 'Foundation must be completed and cured. Access for delivery vehicles and crane must be arranged.',
            },
            {
              number: 2,
              title: 'Delivery & Unloading',
              body: 'Manufacturing kit components arrive on-site. Crane unloads wall panels, roof trusses, and materials.',
            },
            {
              number: 3,
              title: 'Wall Erection',
              body: 'Pre-fabricated wall panels are lifted into position and secured to the foundation and to each other.',
            },
            {
              number: 4,
              title: 'Roof Installation',
              body: 'Roof trusses are lifted and secured. OSB roof base and initial weatherproofing applied.',
            },
            {
              number: 5,
              title: 'Windows & Doors',
              body: 'Triple-glazed windows and exterior doors are installed, making the structure weather-tight.',
            },
            {
              number: 6,
              title: 'Handover',
              body: 'Quality inspection completed. Structure handed over ready for interior finishing works.',
            },
          ],
        },
        {
          blockType: 'ctaBanner',
          heading: 'Need Assembly Services?',
          subheading: 'Our teams work across Europe. Contact us for availability and pricing.',
          ctaLabel: 'Contact Us',
          ctaHref: '/en/contacts',
          variant: 'solid',
        },
      ],
    },
  })

  // ── PRODUCTION PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Production',
      slug: 'production',
      status: 'published',
      hero: {
        heading: 'Production',
        subheading: 'State-of-the-art manufacturing facility in Latvia',
        variant: 'fullscreen',
      },
      sections: [
        {
          blockType: 'textImage',
          heading: 'Our Manufacturing Facility',
          body: paragraphs(
            'The Norge House manufacturing facility is equipped with modern technology that ensures precision, quality and efficiency in every stage of production.',
            'The use of up-to-date technology in the manufacturing process ensures quality, durability and energy efficiency. The quality of production is confirmed by all necessary internationally recognized material quality certificates.',
          ),
          imagePosition: 'right',
        },
        {
          blockType: 'stepProcess',
          heading: 'Production Process',
          variant: 'numbered',
          steps: [
            {
              number: 1,
              title: 'Design & Engineering',
              body: 'Every project begins with detailed architectural and structural engineering. CAD/CAM systems generate precise cutting plans for each component.',
            },
            {
              number: 2,
              title: 'Timber Preparation',
              body: 'Kiln-dried C24 structural timber is cut to exact dimensions using CNC machinery. All cuts are made with millimetre precision.',
            },
            {
              number: 3,
              title: 'Wall Panel Assembly',
              body: 'Wall panels are assembled in our factory — structural frame, insulation, OSB sheathing, vapour barrier, and facade cladding are all integrated.',
            },
            {
              number: 4,
              title: 'Window & Door Integration',
              body: 'Triple-glazed windows and doors are factory-fitted into wall panels, ensuring perfect alignment and weatherproofing.',
            },
            {
              number: 5,
              title: 'Quality Control',
              body: 'Every component undergoes rigorous quality inspection before packaging. Dimensions, materials, and assembly quality are all verified.',
            },
            {
              number: 6,
              title: 'Packaging & Shipping',
              body: 'Components are carefully packaged and loaded for transport. Detailed assembly instructions and drawings accompany every delivery.',
            },
          ],
        },
        {
          blockType: 'stats',
          heading: 'Production Capacity',
          stats: [
            { value: 3000, label: 'Factory Area (m²)', suffix: '' },
            { value: 50, label: 'Houses Per Year', suffix: '+' },
            { value: 5, label: 'Day Min. Production Time', suffix: '' },
            { value: 100, label: 'Quality Checked', suffix: '%' },
          ],
        },
        {
          blockType: 'ctaBanner',
          heading: 'Visit Our Factory',
          subheading: 'We welcome visitors to our production facility in Latvia. See the quality for yourself.',
          ctaLabel: 'Contact Us to Arrange a Visit',
          ctaHref: '/en/contacts',
          variant: 'image-overlay',
        },
      ],
    },
  })

  // ── B2B PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'B2B',
      slug: 'b2b',
      status: 'published',
      hero: {
        heading: 'B2B Partnership',
        subheading: 'Partner with us for high-quality timber-frame prefab house solutions',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'textImage',
          heading: 'Global Export & Partnership',
          body: paragraphs(
            'Timber frame house manufacturing company Norge House offers global export and partnership. Norge House offers a global export of a high quality product that is manufactured according to the most modern Scandinavian standards for an affordable price.',
            'In the past two years Norge House has established export routes around Europe and has established partnerships with companies that work in fields such as Architecture, Construction and Real Estate Development.',
            'Our main goal is to introduce Europe to a high quality product that is affordable and innovative. We are looking for partners that could represent our company outside of our country and are looking to establish a mutually beneficial partnership to make it last for years to come.',
          ),
          imagePosition: 'right',
        },
        {
          blockType: 'featureGrid',
          heading: 'We Are Looking For',
          columns: '3',
          items: [
            {
              icon: 'architecture',
              title: 'Architectural Companies',
              body: 'Design firms who want to offer their clients high-quality, ready-to-build timber frame house solutions.',
            },
            {
              icon: 'construction',
              title: 'Construction Companies',
              body: 'Builders looking for reliable, precision-manufactured timber frame kits that speed up construction timelines.',
            },
            {
              icon: 'distributor',
              title: 'Distributors',
              body: 'Partners who can represent Norge House in their local markets and connect us with end customers.',
            },
            {
              icon: 'developer',
              title: 'Real Estate Developers',
              body: 'Developers seeking cost-effective, energy-efficient housing solutions for residential developments.',
            },
            {
              icon: 'investor',
              title: 'Investors',
              body: 'Investment partners interested in the growing European timber frame housing market.',
            },
            {
              icon: 'warranty',
              title: 'Quality Guarantee',
              body: '10-year warranty on all manufacturing kits. All materials certified to European standards. Partner bank available for financing solutions.',
            },
          ],
        },
        {
          blockType: 'contactForm',
          heading: 'Become a Partner',
          formType: 'b2b',
          successMessage: 'Thank you for your interest! Our B2B team will contact you within 2 business days.',
        },
      ],
    },
  })

  // ── CONTACTS PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contacts',
      slug: 'contacts',
      status: 'published',
      hero: {
        heading: 'Contact Us',
        subheading: 'Get in touch with Norge House',
        variant: 'compact',
      },
      sections: [
        {
          blockType: 'featureGrid',
          heading: 'Our Details',
          columns: '3',
          items: [
            {
              icon: 'location',
              title: 'Address',
              body: 'Sū iela 10\nMārupe, LV-2166\nLatvia',
            },
            {
              icon: 'phone',
              title: 'Phone',
              body: '+371 25 901 010\n+371 20 35 22 88',
            },
            {
              icon: 'email',
              title: 'Email',
              body: 'info@norgehouse.com',
            },
          ],
        },
        {
          blockType: 'contactForm',
          heading: 'Send Us a Message',
          formType: 'general',
          successMessage: 'Thank you for your message! We will get back to you within 1-2 business days.',
        },
        {
          blockType: 'map',
          heading: 'Find Us',
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2176.5!2d24.0458!3d56.9019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTbCsDU0JzA3LjAiTiAyNMKwMDInNDUuMCJF!5e0!3m2!1slv!2slv!4v1',
          address: 'Sū iela 10, Mārupe, LV-2166, Latvia',
          zoom: 14,
        },
      ],
    },
  })

  // ═══════════════════════════════════════════════════════
  // PROJECTS — real house data from norgehouse.com
  // ═══════════════════════════════════════════════════════

  const projects = [
    // ── Modular Houses ──
    {
      title: 'House Module 2',
      slug: 'house-module-2',
      areaSqm: 22,
      livingArea: 22,
      levels: 1,
      houseType: 'module' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A compact modular unit with 22 m² of usable space. Accommodates 2 people. Ideal as a guest house, office, or holiday cabin. Delivered fully assembled.'),
    },
    {
      title: 'House Module 3',
      slug: 'house-module-3',
      areaSqm: 32.5,
      livingArea: 32.5,
      rooms: 2,
      levels: 1,
      houseType: 'module' as const,
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A functional modular house with 32.5 m² of space, featuring 1 bedroom and 1 bathroom. Perfect as a compact permanent residence or holiday home.'),
    },
    {
      title: 'House Module 4',
      slug: 'house-module-4',
      areaSqm: 43.7,
      livingArea: 43.7,
      rooms: 2,
      levels: 1,
      houseType: 'module' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A spacious modular house with 43.7 m² of space. Features 1 bedroom and 1 bathroom with an open-plan living area and kitchen.'),
    },
    {
      title: 'House Module 5',
      slug: 'house-module-5',
      areaSqm: 54.1,
      livingArea: 54.1,
      rooms: 3,
      levels: 1,
      houseType: 'module' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('Our largest modular unit at 54.1 m². Features 2 bedrooms and 1 bathroom. A comfortable modular home suitable for a small family.'),
    },
    {
      title: 'House Module 35',
      slug: 'house-module-35',
      areaSqm: 35,
      livingArea: 35,
      levels: 1,
      houseType: 'module' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A versatile 35 m² modular unit. Can be configured as a residence, office, or commercial space.'),
    },
    {
      title: 'House Module Sauna 3',
      slug: 'house-module-sauna-3',
      areaSqm: 32.1,
      livingArea: 32.1,
      rooms: 2,
      levels: 1,
      houseType: 'module' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A 32.1 m² modular sauna house. Accommodates 2 people. Combines a traditional sauna with comfortable living space — perfect for relaxation.'),
    },
    // ── Small Houses ──
    {
      title: 'House 25',
      slug: 'house-25',
      areaSqm: 24.9,
      livingArea: 24.9,
      levels: 1,
      houseType: 'single-storey' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A compact 24.9 m² single-storey house. An affordable entry point to Norge House quality — ideal as a garden house, guest house, or small holiday home.'),
    },
    // ── Standard Houses ──
    {
      title: 'House 70',
      slug: 'house-70',
      areaSqm: 69.7,
      livingArea: 69.7,
      cubicCapacity: 195.3,
      height: 4.29,
      roofSlope: 2,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 62730,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A compact single-storey house with a modern flat roof design. Perfect as a holiday home or compact permanent residence. The open-plan layout maximises the living space.'),
    },
    {
      title: 'House 79',
      slug: 'house-79',
      areaSqm: 78.6,
      livingArea: 78.6,
      cubicCapacity: 227.24,
      height: 4.85,
      roofSlope: 2,
      rooms: 3,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 64180,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A well-proportioned 3-room single-storey home with 78.6 m² of living space. Features 2 bedrooms and 1 bathroom with a modern flat roof design.'),
    },
    {
      title: 'House 80',
      slug: 'house-80',
      areaSqm: 158.1,
      livingArea: 80,
      cubicCapacity: 353.88,
      height: 6.64,
      roofSlope: 30,
      rooms: 3,
      levels: 2,
      houseType: 'two-storey' as const,
      price: 43490,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A two-storey house with 80 m² of living area and a total area of 158.1 m². The 30° roof slope gives it a classic Nordic appearance. Our most affordable project — ideal as a starter home.'),
    },
    {
      title: 'House 85',
      slug: 'house-85',
      areaSqm: 85.1,
      livingArea: 85.1,
      cubicCapacity: 238.22,
      height: 6.04,
      roofSlope: 25,
      rooms: 4,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 76590,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A spacious 4-room single-storey house with a pitched roof design. Features a generous living area, separate kitchen, and three bedrooms. Roof slope of 25° gives the house a traditional Nordic appearance.'),
    },
    {
      title: 'House 86',
      slug: 'house-86',
      areaSqm: 85.8,
      livingArea: 85.8,
      cubicCapacity: 231.55,
      height: 3.95,
      roofSlope: 2,
      rooms: 3,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 77220,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A modern 3-room single-storey house with a contemporary flat roof. The low-profile design with 2° roof slope creates a sleek, modern aesthetic. Open-plan living area with two bedrooms.'),
    },
    {
      title: 'House 99',
      slug: 'house-99',
      areaSqm: 99.1,
      livingArea: 99.1,
      cubicCapacity: 267.6,
      height: 3.95,
      roofSlope: 1,
      rooms: 4,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 89190,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A 4-room family house with nearly 100m² of living space. Flat roof design with generous room proportions. Features an open-plan kitchen/living area and three comfortable bedrooms.'),
    },
    {
      title: 'House 88',
      slug: 'house-88',
      areaSqm: 121.5,
      livingArea: 88.4,
      garageArea: 17.34,
      cubicCapacity: 298.81,
      height: 7.36,
      roofSlope: 40,
      rooms: 4,
      levels: 2,
      houseType: 'two-storey' as const,
      price: 95130,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A 4-room two-storey house with 88.4 m² of living area, featuring 3 bedrooms and 2 bathrooms. Includes an integrated 17.34 m² garage. The steep 40° roof slope creates a striking architectural profile.'),
    },
    {
      title: 'House 106',
      slug: 'house-106',
      areaSqm: 139.4,
      livingArea: 99.9,
      garageArea: 35.5,
      levels: 1,
      houseType: 'single-storey' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A single-storey house with an integrated garage. Total area of 139.4 m² includes a generous 35.5 m² garage. Living area of nearly 100 m² provides comfortable family living.'),
    },
    {
      title: 'House 107',
      slug: 'house-107',
      areaSqm: 106.7,
      livingArea: 102.9,
      cubicCapacity: 298.4,
      height: 5.48,
      roofSlope: 22,
      rooms: 4,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 92610,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A well-designed single-storey house with over 100 m² of living space. The building height of 5.48 m allows for vaulted ceilings in the main living areas, creating a sense of spaciousness.'),
    },
    {
      title: 'House 114',
      slug: 'house-114',
      areaSqm: 113.6,
      livingArea: 109.1,
      cubicCapacity: 422.12,
      height: 7.74,
      roofSlope: 30,
      rooms: 4,
      levels: 2,
      houseType: 'two-storey' as const,
      price: 100200,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A 4-room two-storey house with 109.1 m² of living area. The 7.74 m height and 30° roof slope create spacious upper-floor rooms. Total area of 113.6 m².'),
    },
    {
      title: 'House 122',
      slug: 'house-122',
      areaSqm: 122.5,
      livingArea: 122.5,
      cubicCapacity: 324.7,
      height: 7.35,
      roofSlope: 35,
      rooms: 4,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 110250,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A spacious 4-room family home with 122.5 m² of living space. The 7.35 m building height with 35° roof slope provides opportunities for vaulted living spaces and second-floor loft areas.'),
    },
    {
      title: 'House 124',
      slug: 'house-124',
      areaSqm: 121.6,
      livingArea: 121.6,
      cubicCapacity: 364.82,
      height: 7.41,
      roofSlope: 35,
      rooms: 4,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 109350,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A spacious and beautiful 4-room house with three bedrooms and two bathrooms. 121.6 m² of living area with a 35° roof slope for a classic appearance.'),
    },
    {
      title: 'House 125',
      slug: 'house-125',
      areaSqm: 125.5,
      livingArea: 125.5,
      height: 5.76,
      rooms: 9,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 112950,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A large 9-room family house with 125.5 m² of living space. Ideal for larger families, with multiple bedrooms, bathrooms, and utility rooms. Well-planned layout maximises every square metre.'),
    },
    {
      title: 'House 127',
      slug: 'house-127',
      areaSqm: 126.5,
      livingArea: 126.5,
      cubicCapacity: 354.21,
      height: 6.5,
      roofSlope: 25,
      rooms: 5,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 113850,
      priceNote: 'excl. VAT',
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A 5-room family home with 126.5 m² of living area. The 6.5 m building height with 25° roof slope creates airy interiors. Well-suited for larger families.'),
    },
    {
      title: 'House 129',
      slug: 'house-129',
      areaSqm: 158.4,
      livingArea: 128.9,
      garageArea: 29,
      levels: 1,
      houseType: 'single-storey' as const,
      featured: false,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A substantial family home with integrated 29 m² garage. Total area of 158.4 m² with 128.9 m² of living space. Combines comfortable living with practical garage storage.'),
    },
    {
      title: 'House 219',
      slug: 'house-219',
      areaSqm: 219.6,
      livingArea: 219.6,
      garageArea: 43.7,
      cubicCapacity: 647.72,
      height: 7.15,
      roofSlope: 2,
      rooms: 6,
      levels: 2,
      houseType: 'two-storey' as const,
      price: 137660,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('A premium 6-room two-storey house with 219.6 m² of living area and an integrated 43.7 m² garage. Flat roof design with modern aesthetics. One of our largest projects.'),
    },
    {
      title: 'House 225',
      slug: 'house-225',
      areaSqm: 224.7,
      livingArea: 178.7,
      garageArea: 38.5,
      cubicCapacity: 644.79,
      height: 4.85,
      rooms: 5,
      levels: 1,
      houseType: 'single-storey' as const,
      price: 195480,
      priceNote: 'excl. VAT',
      featured: true,
      year: 2024,
      location: 'Latvia',
      country: 'Latvia',
      description: p('Our flagship 5-room house with 178.7 m² of living area plus a spacious 38.5 m² integrated garage. Total area of 224.7 m² makes this our largest standard project. Premium family living at its finest.'),
    },
  ]

  for (const project of projects) {
    await payload.create({
      collection: 'projects',
      data: project as Record<string, unknown>,
    })
  }

  // ── Completely Finished House (News article) ──
  await payload.create({
    collection: 'news',
    data: {
      title: 'Completely Finished House Project',
      slug: 'completely-finished-house-project',
      status: 'published',
      excerpt: 'Norge House now offers a completely finished modular house with a total usable area of 32.5 m², priced at €66,000 + VAT.',
      content: paragraphs(
        'We are excited to announce our new completely finished house project — a fully furnished and ready-to-move-in timber frame modular house.',
        'This compact yet functional home has a total usable area of 32.5 m² and comes at a price of €66,000 + VAT. It includes all interior finishing, kitchen, bathroom, and is delivered fully assembled.',
        'The completely finished house is ideal for those who want a quick, hassle-free solution — simply prepare the foundation, and we deliver a ready-to-live-in home.',
        'Contact us for more information and to arrange a viewing of our showroom model.',
      ),
      publishedAt: '2024-01-15T00:00:00.000Z',
    },
  })

  console.log('Seed completed:')
  console.log('  - Admin user')
  console.log('  - Navigation (4 locales)')
  console.log('  - Site Settings')
  console.log('  - 10 Pages (Home, About Us, Manufacturing Kit, Construction Stages, Units, Materials, Montage, Production, B2B, Contacts)')
  console.log('  - Design partner: Z500')
  console.log(`  - ${projects.length} Projects (real house data from norgehouse.com)`)
  console.log('  - 1 News article')
}
