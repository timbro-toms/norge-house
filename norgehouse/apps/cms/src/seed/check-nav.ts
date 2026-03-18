import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  // Check all navigation documents
  const navs = await payload.find({
    collection: 'navigation',
    limit: 10,
    depth: 0,
  })

  console.log(`Found ${navs.docs.length} navigation documents:\n`)

  for (const nav of navs.docs) {
    const n = nav as { id: string | number; locale: string; items: { label: string; href: string }[] }
    console.log(`ID: ${n.id}, locale field: "${n.locale}"`)
    console.log(`  Items: ${n.items?.map(i => `${i.label} (${i.href})`).join(', ')}`)
    console.log('')
  }

  // Test what getNavigation would return for "en"
  console.log('--- Testing queries ---')
  for (const locale of ['en', 'lv', 'de', 'it']) {
    const result = await payload.find({
      collection: 'navigation',
      where: { locale: { equals: locale } },
      limit: 1,
      depth: 0,
    })
    if (result.docs.length > 0) {
      const doc = result.docs[0] as { locale: string; items: { label: string; href: string }[] }
      console.log(`Query locale="${locale}": found doc with locale="${doc.locale}", first item: ${doc.items?.[0]?.label}`)
    } else {
      console.log(`Query locale="${locale}": NO DOCUMENT FOUND`)
    }
  }

  process.exit(0)
}

run().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
