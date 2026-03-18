import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'

const LEGACY_DIR = 'c:/dev/karlis-norge/legacynorge/crownme.norgehouse.com'

interface ImageDef {
  sourcePath: string
  alt: string
  filename: string
}

async function uploadImage(payload: Payload, def: ImageDef): Promise<string | null> {
  const fullPath = path.resolve(def.sourcePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`  Image not found: ${fullPath}`)
    return null
  }

  const data = fs.readFileSync(fullPath)
  const stats = fs.statSync(fullPath)
  const ext = path.extname(fullPath).toLowerCase()
  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
  }

  const result = await payload.create({
    collection: 'media',
    data: {
      alt: def.alt,
    },
    file: {
      data: Buffer.from(data),
      mimetype: mimeMap[ext] || 'image/jpeg',
      name: def.filename,
      size: stats.size,
    },
  })

  return result.id as string
}

export async function uploadImages(payload: Payload): Promise<void> {
  console.log('Starting image upload...')

  // ── Upload logo ──
  const logoId = await uploadImage(payload, {
    sourcePath: `${LEGACY_DIR}/assets/frontend/img/logo/logo_norgehouse_ori.png`,
    alt: 'Norge House Logo',
    filename: 'norge-house-logo.png',
  })
  console.log(`  Logo uploaded: ${logoId ? '✓' : '✗'}`)

  // ── Upload hero backgrounds ──
  const heroImages: ImageDef[] = [
    {
      sourcePath: `${LEGACY_DIR}/assets/frontend/img/hero-slider/main-bg.jpg`,
      alt: 'Norge House - timber frame house',
      filename: 'hero-main-bg.jpg',
    },
    {
      sourcePath: `${LEGACY_DIR}/assets/frontend/img/hero-slider/main-bg-yard.jpg`,
      alt: 'Norge House - house with yard',
      filename: 'hero-yard-bg.jpg',
    },
    {
      sourcePath: `${LEGACY_DIR}/assets/frontend/img/hero/hero-bg.jpg`,
      alt: 'Norge House - production facility',
      filename: 'hero-production-bg.jpg',
    },
  ]

  const heroIds: string[] = []
  for (const img of heroImages) {
    const id = await uploadImage(payload, img)
    if (id) heroIds.push(id)
    console.log(`  Hero image "${img.filename}" uploaded: ${id ? '✓' : '✗'}`)
  }

  // ── Upload some house images from uploads directory ──
  // These are the actual house project images from the old CMS
  const uploadsDir = `${LEGACY_DIR}/uploads`
  const houseImages: ImageDef[] = [
    { sourcePath: `${uploadsDir}/1900x1000precise-1.jpg`, alt: 'Norge House project', filename: 'house-project-1.jpg' },
    { sourcePath: `${uploadsDir}/1900x1000precise-2.jpg`, alt: 'Norge House project', filename: 'house-project-2.jpg' },
    { sourcePath: `${uploadsDir}/0av09981.jpg`, alt: 'Norge House construction', filename: 'construction-1.jpg' },
    { sourcePath: `${uploadsDir}/2018-07-0908-01-57.jpg`, alt: 'Norge House production', filename: 'production-1.jpg' },
    { sourcePath: `${uploadsDir}/2018-07-0908-02-12.jpg`, alt: 'Norge House production', filename: 'production-2.jpg' },
    { sourcePath: `${uploadsDir}/2018-07-0908-02-20.jpg`, alt: 'Norge House production', filename: 'production-3.jpg' },
  ]

  const houseImageIds: string[] = []
  for (const img of houseImages) {
    const id = await uploadImage(payload, img)
    if (id) houseImageIds.push(id)
    console.log(`  House image "${img.filename}" uploaded: ${id ? '✓' : '✗'}`)
  }

  // ── Upload gallery/component images ──
  const componentImages: ImageDef[] = []
  const componentsDir = `${LEGACY_DIR}/assets/frontend/img/components`
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
    for (const file of files.slice(0, 10)) {
      componentImages.push({
        sourcePath: `${componentsDir}/${file}`,
        alt: `Norge House construction component`,
        filename: `component-${file}`,
      })
    }
  }

  for (const img of componentImages) {
    const id = await uploadImage(payload, img)
    console.log(`  Component "${img.filename}": ${id ? '✓' : '✗'}`)
  }

  // ── Link hero image to home page ──
  if (heroIds.length > 0) {
    const homePage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })

    if (homePage.docs.length > 0) {
      await payload.update({
        collection: 'pages',
        id: homePage.docs[0].id as string,
        data: {
          hero: {
            backgroundImage: heroIds[0],
          },
        },
      })
      console.log('  Home page hero image linked ✓')
    }

    // Link hero to production page
    const prodPage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'production' } },
      limit: 1,
    })

    if (prodPage.docs.length > 0 && heroIds.length > 2) {
      await payload.update({
        collection: 'pages',
        id: prodPage.docs[0].id as string,
        data: {
          hero: {
            backgroundImage: heroIds[2],
          },
        },
      })
      console.log('  Production page hero image linked ✓')
    }
  }

  // ── Assign cover images to projects ──
  if (houseImageIds.length > 0) {
    const allProjects = await payload.find({
      collection: 'projects',
      limit: 100,
    })

    for (let i = 0; i < allProjects.docs.length; i++) {
      const imgId = houseImageIds[i % houseImageIds.length]
      await payload.update({
        collection: 'projects',
        id: allProjects.docs[i].id as string,
        data: {
          coverImage: imgId,
        },
      })
    }
    console.log(`  Cover images assigned to ${allProjects.docs.length} projects ✓`)
  }

  console.log('\nImage upload complete!')
}
