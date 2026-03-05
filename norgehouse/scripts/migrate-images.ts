/**
 * Image Migration Script
 *
 * Crawls the existing norgehouse.com site, downloads all images,
 * and uploads them to the new Payload CMS media library.
 *
 * Usage: npx tsx scripts/migrate-images.ts
 *
 * Environment variables:
 *   PAYLOAD_URL   — URL of the Payload CMS (default: http://localhost:3001)
 *   PAYLOAD_TOKEN — Bearer token for Payload API authentication
 */

import * as https from 'https'
import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const PAYLOAD_TOKEN = process.env.PAYLOAD_TOKEN || ''
const SITE_URL = 'https://norgehouse.com'
const CONCURRENCY = 3

// Simple concurrency limiter
async function pLimit<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (const task of tasks) {
    const p = task().then((result) => {
      results.push(result)
    })
    executing.push(p)

    if (executing.length >= limit) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex((e) => e === p),
        1,
      )
    }
  }

  await Promise.all(executing)
  return results
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          return fetchUrl(res.headers.location).then(resolve).catch(reject)
        }
      }
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function downloadBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          return downloadBuffer(res.headers.location).then(resolve).catch(reject)
        }
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function getSitemapUrls(): Promise<string[]> {
  console.log('Fetching sitemap...')
  try {
    const xml = await fetchUrl(`${SITE_URL}/sitemap.xml`)
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    console.log(`Found ${urls.length} URLs in sitemap`)
    return urls
  } catch {
    console.log('Sitemap not found, trying sitemap_index.xml...')
    try {
      const indexXml = await fetchUrl(`${SITE_URL}/sitemap_index.xml`)
      const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
      const allUrls: string[] = []
      for (const sitemapUrl of sitemapUrls) {
        const xml = await fetchUrl(sitemapUrl)
        const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
        allUrls.push(...urls)
      }
      console.log(`Found ${allUrls.length} URLs across ${sitemapUrls.length} sitemaps`)
      return allUrls
    } catch {
      console.log('No sitemap found. Using known page URLs.')
      return [
        `${SITE_URL}/en/home/`,
        `${SITE_URL}/en/about-us/`,
        `${SITE_URL}/en/projects/`,
        `${SITE_URL}/en/contacts/`,
      ]
    }
  }
}

async function extractImageUrls(pageUrl: string): Promise<string[]> {
  try {
    const html = await fetchUrl(pageUrl)
    const imgMatches = [...html.matchAll(/(?:src|srcset)=["']([^"']+\.(?:jpg|jpeg|png|webp|svg))[^"']*["']/gi)]
    return imgMatches
      .map((m) => {
        let url = m[1].split(/[,\s]/)[0] // Handle srcset
        if (url.startsWith('//')) url = 'https:' + url
        else if (url.startsWith('/')) url = SITE_URL + url
        return url
      })
      .filter((url) => url.startsWith('http'))
  } catch {
    return []
  }
}

async function uploadToPayload(imageUrl: string, buffer: Buffer): Promise<string | null> {
  const filename = path.basename(new URL(imageUrl).pathname)
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  const mimeType = mimeTypes[ext] || 'image/jpeg'

  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2)

  const fileField = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${filename}"`,
    `Content-Type: ${mimeType}`,
    '',
  ].join('\r\n')

  const altField = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="alt"',
    '',
    filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  ].join('\r\n')

  const bodyParts = [
    Buffer.from(fileField + '\r\n'),
    buffer,
    Buffer.from('\r\n' + altField + '\r\n--' + boundary + '--\r\n'),
  ]

  const body = Buffer.concat(bodyParts)

  return new Promise((resolve) => {
    const url = new URL(`${PAYLOAD_URL}/api/media`)
    const client = url.protocol === 'https:' ? https : http

    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
          ...(PAYLOAD_TOKEN ? { Authorization: `Bearer ${PAYLOAD_TOKEN}` } : {}),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            resolve(json.doc?.id || null)
          } catch {
            resolve(null)
          }
        })
      },
    )

    req.on('error', () => resolve(null))
    req.write(body)
    req.end()
  })
}

async function main() {
  console.log('=== Norge House Image Migration ===\n')

  // Step 1: Get all page URLs
  const pageUrls = await getSitemapUrls()

  // Step 2: Extract image URLs from all pages
  console.log('\nExtracting images from pages...')
  const allImageUrls = new Set<string>()

  for (const pageUrl of pageUrls) {
    const images = await extractImageUrls(pageUrl)
    images.forEach((url) => allImageUrls.add(url))
  }

  console.log(`Found ${allImageUrls.size} unique images\n`)

  // Step 3: Download and upload each image
  const mapping: Record<string, string> = {}
  let uploaded = 0
  let failed = 0

  const tasks = [...allImageUrls].map((imageUrl) => async () => {
    try {
      const buffer = await downloadBuffer(imageUrl)
      const mediaId = await uploadToPayload(imageUrl, buffer)
      if (mediaId) {
        mapping[imageUrl] = mediaId
        uploaded++
        console.log(`  [OK] ${imageUrl} → ${mediaId}`)
      } else {
        failed++
        console.log(`  [FAIL] ${imageUrl} — upload failed`)
      }
    } catch (err) {
      failed++
      console.log(`  [SKIP] ${imageUrl} — ${(err as Error).message}`)
    }
  })

  await pLimit(tasks, CONCURRENCY)

  // Step 4: Save mapping
  const mappingPath = path.join(__dirname, 'image-map.json')
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2))

  console.log('\n=== Migration Summary ===')
  console.log(`  Total images found: ${allImageUrls.size}`)
  console.log(`  Successfully uploaded: ${uploaded}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Mapping saved to: ${mappingPath}`)
}

main().catch(console.error)
