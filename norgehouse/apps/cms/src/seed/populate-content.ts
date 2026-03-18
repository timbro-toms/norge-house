import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'

const UPLOADS_DIR = 'C:/dev/karlis-norge/legacynorge/httpdocs/uploads'
const FM = `${UPLOADS_DIR}/filemanager`

// ─── Upload helper ───────────────────────────────────────────────
async function upload(payload: Payload, sourcePath: string, alt: string, filename: string): Promise<number | null> {
  const full = path.resolve(sourcePath)
  if (!fs.existsSync(full)) {
    console.log(`  ✗ Not found: ${full}`)
    return null
  }
  // Check if already uploaded (by filename) to avoid duplicates
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (existing.docs.length > 0) {
    console.log(`  ○ Already exists: ${filename}`)
    return Number(existing.docs[0].id)
  }
  const data = fs.readFileSync(full)
  const stats = fs.statSync(full)
  const ext = path.extname(full).toLowerCase()
  const mime: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif',
  }
  try {
    const result = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: Buffer.from(data), mimetype: mime[ext] || 'image/jpeg', name: filename, size: stats.size },
    })
    console.log(`  ✓ Uploaded: ${filename}`)
    return Number(result.id)
  } catch (e: unknown) {
    console.log(`  ✗ Upload failed ${filename}: ${e instanceof Error ? e.message : String(e)}`)
    return null
  }
}

// Lexical helpers
function lexParagraph(text: string) {
  return {
    type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
    children: [{ type: 'text', text, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
  }
}

function lexHeading(text: string, tag = 'h2') {
  return {
    type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'text', text, format: 0, mode: 'normal', style: '', detail: 0, version: 1 }],
  }
}

function lexRoot(children: unknown[]) {
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}

// ─── Main populate function ──────────────────────────────────────
export async function populateContent(payload: Payload): Promise<void> {
  console.log('\n═══ UPLOADING IMAGES ═══\n')

  // ── Homepage slider images ──
  const sliderImages: Record<string, number | null> = {}
  const sliderSrc = [
    { file: `${FM}/SAKUMS/Bilde_majaslapai_001.jpg`, name: 'slider-house-main.jpg', alt: 'Norge House - timber frame house' },
    { file: `${FM}/SAKUMS/Bilde_majaslapai_003b.jpg`, name: 'slider-house-2.jpg', alt: 'Norge House - modern timber frame' },
    { file: `${FM}/SAKUMS/Bilde_majaslapai_003c.jpg`, name: 'slider-house-3.jpg', alt: 'Norge House - Scandinavian design' },
    { file: `${FM}/SAKUMS/Bilde_majaslapai_004c.jpg`, name: 'slider-house-4.jpg', alt: 'Norge House - quality home' },
  ]
  for (const s of sliderSrc) {
    sliderImages[s.name] = await upload(payload, s.file, s.alt, s.name)
  }

  // ── Slider / gallery images ──
  const sliderDir = `${FM}/Slaideri`
  const sliderGalleryIds: number[] = []
  if (fs.existsSync(sliderDir)) {
    const files = fs.readdirSync(sliderDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.includes('Copy')).slice(0, 10)
    for (const f of files) {
      const id = await upload(payload, `${sliderDir}/${f}`, 'Norge House project', `slider-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) sliderGalleryIds.push(id)
    }
  }

  // ── Construction stages images ──
  const stagesDir = `${FM}/NORGE_HOUSE_BUVNIECIBAS_ETAPI`
  const stageIds: number[] = []
  if (fs.existsSync(stagesDir)) {
    const files = fs.readdirSync(stagesDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.includes('Copy')).slice(0, 12)
    for (const f of files) {
      const id = await upload(payload, `${stagesDir}/${f}`, 'Construction stages', `stages-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) stageIds.push(id)
    }
  }

  // ── Manufacturing kit images ──
  const kitDir = `${FM}/NORGE_HOUSE_KOMPLEKTACIJA`
  const kitIds: number[] = []
  if (fs.existsSync(kitDir)) {
    const files = fs.readdirSync(kitDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    for (const f of files) {
      const id = await upload(payload, `${kitDir}/${f}`, 'Manufacturing kit component', `kit-${f}`)
      if (id) kitIds.push(id)
    }
  }

  // ── Units / wall construction images ──
  const unitsDir = `${FM}/NORGE_HOUSE_MEZGLI`
  const unitIds: number[] = []
  if (fs.existsSync(unitsDir)) {
    const files = fs.readdirSync(unitsDir).filter(f => /ENG.*\.(jpg|jpeg|png)$/i.test(f) && !f.includes('Copy')).slice(0, 8)
    for (const f of files) {
      const id = await upload(payload, `${unitsDir}/${f}`, 'Wall unit construction diagram', `units-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) unitIds.push(id)
    }
  }

  // ── About company images ──
  const aboutDir = `${FM}/PAR_UZNEMUMU_BILDES`
  const aboutIds: number[] = []
  if (fs.existsSync(aboutDir)) {
    const files = fs.readdirSync(aboutDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).slice(0, 6)
    for (const f of files) {
      const id = await upload(payload, `${aboutDir}/${f}`, 'About Norge House', `about-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) aboutIds.push(id)
    }
  }

  // ── Building exterior images ──
  const extDir = `${FM}/NORGE_HOUSE_EKU_BILDES`
  const extIds: number[] = []
  if (fs.existsSync(extDir)) {
    const files = fs.readdirSync(extDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.includes('Copy')).slice(0, 4)
    for (const f of files) {
      const id = await upload(payload, `${extDir}/${f}`, 'Norge House building', `building-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) extIds.push(id)
    }
  }

  // ── Banners for hero/CTA backgrounds ──
  const bannerIds: number[] = []
  const bannerFiles = [
    { file: `${FM}/Banneri/001.jpg`, name: 'banner-001.jpg', alt: 'Norge House banner' },
    { file: `${FM}/Banneri/002.jpg`, name: 'banner-002.jpg', alt: 'Norge House banner' },
    { file: `${FM}/Banneri/003.jpg`, name: 'banner-003.jpg', alt: 'Norge House banner' },
    { file: `${FM}/DJI_0149 1000 705.jpg`, name: 'drone-factory.jpg', alt: 'Norge House factory aerial view' },
    { file: `${FM}/Norge House 1.jpg`, name: 'norge-house-exterior.jpg', alt: 'Norge House exterior' },
  ]
  for (const b of bannerFiles) {
    const id = await upload(payload, b.file, b.alt, b.name)
    if (id) bannerIds.push(id)
  }

  // ── News images ──
  const newsDir = `${FM}/JAUNUMI`
  const newsIds: number[] = []
  if (fs.existsSync(newsDir)) {
    const files = fs.readdirSync(newsDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).slice(0, 8)
    for (const f of files) {
      const id = await upload(payload, `${newsDir}/${f}`, 'Norge House news', `news-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) newsIds.push(id)
    }
  }

  // ── Gallery images ──
  const galDir = `${FM}/GALERIJAS`
  const galIds: number[] = []
  if (fs.existsSync(galDir)) {
    const files = fs.readdirSync(galDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).slice(0, 12)
    for (const f of files) {
      const id = await upload(payload, `${galDir}/${f}`, 'Norge House gallery', `gallery-${f.replace(/\s/g, '-').toLowerCase()}`)
      if (id) galIds.push(id)
    }
  }

  // Collect all uploaded image IDs for assigning to projects
  const allProjectImages = [...sliderGalleryIds, ...extIds, ...bannerIds, ...galIds].filter(Boolean)

  console.log(`\nTotal images uploaded: sliders=${sliderGalleryIds.length}, stages=${stageIds.length}, kit=${kitIds.length}, units=${unitIds.length}, about=${aboutIds.length}, building=${extIds.length}, banners=${bannerIds.length}, news=${newsIds.length}, gallery=${galIds.length}`)

  // ═══ ASSIGN IMAGES TO PAGES ═══════════════════════════════════
  console.log('\n═══ ASSIGNING IMAGES TO PAGES ═══\n')

  const heroMap: Record<string, number | null> = {
    'home': sliderImages['slider-house-main.jpg'] || bannerIds[0] || null,
    'production': bannerIds[3] || extIds[0] || null,
    'about-us': aboutIds[0] || bannerIds[1] || null,
    'b2b': bannerIds[2] || null,
    'construction-stages': stageIds[0] || null,
    'manufacturing-kit': kitIds[0] || null,
    'units': unitIds[0] || null,
    'montage': stageIds[stageIds.length - 1] || extIds[1] || null,
    'materials': kitIds[1] || stageIds[1] || null,
  }

  const allPages = await payload.find({ collection: 'pages', limit: 20, depth: 0 })

  for (const page of allPages.docs) {
    const slug = page.slug as string
    const heroImg = heroMap[slug]

    if (heroImg) {
      try {
        await payload.update({
          collection: 'pages',
          id: page.id as number,
          data: {
            hero: {
              backgroundImage: heroImg,
            },
          },
        })
        console.log(`  Hero image set for "${slug}" ✓`)
      } catch (e: unknown) {
        console.log(`  ✗ Hero image failed for "${slug}": ${e instanceof Error ? e.message : String(e)}`)
      }
    }
  }

  // ═══ ASSIGN COVER IMAGES TO PROJECTS ══════════════════════════
  console.log('\n═══ ASSIGNING IMAGES TO PROJECTS ═══\n')

  if (allProjectImages.length > 0) {
    const projects = await payload.find({ collection: 'projects', limit: 100, depth: 0 })
    let projOk = 0
    for (let i = 0; i < projects.docs.length; i++) {
      const imgId = allProjectImages[i % allProjectImages.length]
      try {
        await payload.update({
          collection: 'projects',
          id: projects.docs[i].id as number,
          data: { coverImage: imgId },
        })
        projOk++
      } catch (e: unknown) {
        console.log(`  ✗ Project cover failed: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    console.log(`  Cover images assigned to ${projOk}/${projects.docs.length} projects ✓`)
  }

  // ═══ ASSIGN COVER IMAGES TO NEWS ══════════════════════════════
  console.log('\n═══ ASSIGNING IMAGES TO NEWS ═══\n')

  if (newsIds.length > 0 || galIds.length > 0) {
    const allNewsImages = [...newsIds, ...galIds]
    const articles = await payload.find({ collection: 'news', limit: 50, depth: 0 })
    let newsOk = 0
    for (let i = 0; i < articles.docs.length; i++) {
      const imgId = allNewsImages[i % allNewsImages.length]
      try {
        await payload.update({
          collection: 'news',
          id: articles.docs[i].id as number,
          data: { coverImage: imgId },
        })
        newsOk++
      } catch (e: unknown) {
        console.log(`  ✗ News cover failed: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    console.log(`  Cover images assigned to ${newsOk}/${articles.docs.length} articles ✓`)
  }

  // ═══ POPULATE PAGE SECTIONS WITH REAL CONTENT ═════════════════
  console.log('\n═══ POPULATING PAGE SECTIONS ═══\n')

  // Helper to find page and get its sections (depth:0 so image fields are IDs, not objects)
  async function getPage(slug: string) {
    const result = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    return result.docs[0] || null
  }

  // Helper to safely update a page
  async function updatePage(slug: string, updater: (sections: Record<string, unknown>[]) => void) {
    try {
      const page = await getPage(slug)
      if (!page) { console.log(`  ✗ Page "${slug}" not found`); return }
      const sections = (page.sections || []) as Record<string, unknown>[]
      updater(sections)
      await payload.update({ collection: 'pages', id: page.id as number, data: { sections } })
      console.log(`  ✓ ${slug} sections updated`)
    } catch (e: unknown) {
      console.log(`  ✗ Failed to update "${slug}": ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  // ── HOME PAGE ──
  await updatePage('home', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'textImage') {
        sections[i] = { ...sections[i], heading: 'Quality Scandinavian-Style Timber Frame Houses', text: 'Everything we do is what we believe in. Houses that we have created are the best result of our work. They are low cost and made out of high quality and ecological materials that guarantee impeccable quality. The Norge House brand developed through partnerships with Scandinavian companies, incorporating their timber frame expertise.', image: aboutIds[0] || extIds[0] || bannerIds[0] || null }
      }
      if (sections[i].blockType === 'ctaBanner') {
        sections[i] = { ...sections[i], heading: 'Ready to Build Your Dream Home?', description: 'Contact us for a free consultation and quote. We export across Europe and beyond.', backgroundImage: bannerIds[0] || sliderGalleryIds[0] || null }
      }
    }
  })

  // ── ABOUT US PAGE ──
  await updatePage('about-us', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'textImage') {
        sections[i] = { ...sections[i], heading: 'Our Story', text: 'The Norge House brand developed through partnerships with Scandinavian companies, incorporating their timber frame expertise. The manufacturer produces construction units aligned with established Scandinavian and European standards for timber frame building. Norge House manufactures and installs quality timber frame houses using proprietary standards and technology. Originally cooperating with Norwegian firms, the company expanded manufacturing to Latvia to meet demand while developing European trade routes with competitive pricing.', image: aboutIds[1] || extIds[0] || null }
      }
      if (sections[i].blockType === 'richText') {
        sections[i] = { ...sections[i], content: lexRoot([lexHeading('What We Do'), lexParagraph('Timber frame construction, used in Scandinavia for centuries, demonstrates proven longevity and energy efficiency. Contemporary manufacturing technology ensures quality, durability, and performance. Production meets internationally recognized material quality certifications.'), lexParagraph('Design partners include world-renowned firms offering finished projects at economical rates with customization options. The company invites clients to discuss visions and transform dream home concepts into completed projects.')]) }
      }
      if (sections[i].blockType === 'ctaBanner') {
        sections[i] = { ...sections[i], backgroundImage: bannerIds[1] || sliderGalleryIds[1] || null }
      }
    }
  })

  // ── PRODUCTION PAGE ──
  await updatePage('production', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'textImage') {
        sections[i] = { ...sections[i], heading: 'Our Manufacturing Facility', text: 'Norge House is a company that manufactures and installs high-quality timber frame houses, according to the high standards and technology developed by the group, whose plant has been operating in Norway for many years. Timber construction has been used in Norway for centuries, proving durable and energy-efficient. Our approach combines traditional materials with modern production technology to achieve superior thermal insulation and fire safety. All production meets internationally recognized quality certificates.', image: extIds[0] || bannerIds[3] || null }
      }
      if (sections[i].blockType === 'ctaBanner') {
        sections[i] = { ...sections[i], backgroundImage: bannerIds[2] || sliderGalleryIds[2] || null }
      }
    }
  })

  // ── B2B PAGE ──
  await updatePage('b2b', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'textImage') {
        sections[i] = { ...sections[i], heading: 'Global Export & Partnership', text: 'The timber frame house manufacturing company Norge House offers global export and partnership. We produce a high quality product that is manufactured according to the most modern Scandinavian standards for an affordable price. Norge House has established export routes around Europe and partnered with firms in architecture, construction, and real estate development. Our objective is introducing Europe to a high quality product that is affordable and innovative.', image: bannerIds[4] || extIds[1] || null }
      }
    }
  })

  // ── MANUFACTURING KIT PAGE ──
  await updatePage('manufacturing-kit', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'richText' && i === 0) {
        sections[i] = { ...sections[i], content: lexRoot([
          lexParagraph('Norge House provides comprehensive home construction materials including insulation, facade cladding, windows and exterior doors. The kit delivers a weatherproof shell structure, leaving clients to complete roof covering, engineering systems, and interior finishing.'),
          lexHeading('Exterior Walls (250mm thickness)', 'h3'), lexParagraph('Two construction options are offered. Option 1 features wooden boards (21mm) over ventilation layers and rock wool insulation (200mm). Option 2 substitutes a wood fiber plate (50mm) for the decorative boards.'),
          lexHeading('Interior Walls', 'h3'), lexParagraph('Load-bearing walls utilize wooden frame with timber strength class C24 45 x 95 mm sandwiched between OSB boards. Partition walls employ lighter timber framing at 45 x 70mm dimensions.'),
          lexHeading('Ceiling Panels', 'h3'), lexParagraph('Intermediate floors use 22mm OSB with amortization tape and timber frames. Insulated ceilings incorporate rock wool insulation layers totaling 100-200mm depending on specifications.'),
          lexHeading('Roof Construction', 'h3'), lexParagraph('Three variants exist: uninsulated designs with wooden laths and rafters; insulated versions adding 200mm rock wool with vapor barriers; and flat roof systems featuring bitumen covers and layered insulation.'),
          lexHeading('Windows and Doors', 'h3'), lexParagraph('Double selective package with a five-chamber PVC frame construction provides thermal efficiency.'),
        ]) }
      }
    }
  })

  // ── CONSTRUCTION STAGES PAGE ──
  await updatePage('construction-stages', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'stepProcess') {
        sections[i] = { ...sections[i], steps: [
          { title: 'Project Selection', description: 'Find a suitable house project from our website, or submit your own project version adapted to your needs and the characteristics of your building land.' },
          { title: 'Consultation', description: 'When you contact us, we will schedule an appointment to answer all your questions, explain our offering, and describe the advantages of our building type.' },
          { title: 'Contract & Payment', description: 'A production contract is signed: 10% advance upon signing, 50% when production commences, 40% upon assembly/delivery completion.' },
          { title: 'Design', description: 'Initial topographic land measurements are required. Norge House recommends verified architecture partners. Projects must be approved by local building authorities.' },
          { title: 'Production Begins', description: 'Once the project is approved and you receive a building permit, we begin manufacturing the house framework. Manufacturing takes 4-6 weeks.' },
          { title: 'Foundation Construction', description: 'Three foundation types available: foundation slab (plate foundation), strip foundations, or screw piles.' },
          { title: 'Delivery & Assembly', description: 'We load the building kit onto a truck and deliver to the construction site. Assembly takes 2-7 working days depending on project scope.' },
          { title: 'Finishing Work', description: 'Subsequent work includes roof covering, electrical systems, water and sewage networks, heating system, and interior finishing - a free flight of your imagination.' },
        ] }
      }
      if (sections[i].blockType === 'ctaBanner') {
        sections[i] = { ...sections[i], backgroundImage: stageIds[0] || bannerIds[0] || null }
      }
    }
  })

  // ── UNITS PAGE ──
  await updatePage('units', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'richText' && i === 0) {
        sections[i] = { ...sections[i], content: lexRoot([
          lexParagraph('Below you can see all of the units that can be included in the manufacturing kit of the house frame.'),
          lexParagraph('The production of wall units takes into account the most advanced technologies that provide high quality, energy efficiency, durability and safety.'),
        ]) }
      }
    }
  })

  // ── MATERIALS PAGE ──
  await updatePage('materials', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'richText' && i === 0) {
        sections[i] = { ...sections[i], content: lexRoot([
          lexParagraph('All our houses are built using carefully selected, high-quality materials that meet internationally recognized certifications. Below are the key materials used in our manufacturing kits.'),
          lexHeading('Wood Materials', 'h3'), lexParagraph('Carefully selected spruce, pine, and Siberian larch used in structural production. Quality confirmed by internationally recognized certification. C24 strength class wood materials specified for construction.'),
          lexHeading('Stone Wool Insulation (Rockwool / Paroc)', 'h3'), lexParagraph('Paroc stone wool withstands high temperatures. Thermal conductivity: λ-D = 0.036 W/mK. Designed for building insulation and enhanced thermal performance.'),
          lexHeading('OSB Boards', 'h3'), lexParagraph('Water-resistant wood composite material offering strong performance and excellent value. Manufactured with formaldehyde-free adhesive. High stability through multi-layer construction with excellent load capacity.'),
          lexHeading('Diffusion Membrane', 'h3'), lexParagraph('Breathable microporous membrane combining multiple film properties. Protects thermal insulation and wooden structures from water while enabling rapid moisture escape from roof construction components.'),
          lexHeading('Gypsum Board (Drywall)', 'h3'), lexParagraph('Prefabricated installation materials that attach directly to metal profiles or wooden frames. Effective for sound insulation and can be used in floating floor constructions for interior wall and ceiling cladding.'),
        ]) }
      }
    }
  })

  // ── MONTAGE PAGE ──
  await updatePage('montage', (sections) => {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].blockType === 'richText' && i === 0) {
        sections[i] = { ...sections[i], content: lexRoot([
          lexHeading('Assembly A - Z'),
          lexParagraph('Assembly of a house production kit takes up to one week, but a completely finished house project is delivered within 6 months from contract signing. Houses can be customized according to client preferences in both design and layout, as wooden frame houses are easy to modify and adapt to desired specifications.'),
          lexParagraph('In our production process, all wall, floor, and roof panels are manufactured in a controlled factory environment, ensuring precision and quality. Each component is labeled and packed for efficient on-site assembly.'),
        ]) }
      }
    }
  })

  console.log('\n═══ CONTENT POPULATION COMPLETE ═══\n')
}
