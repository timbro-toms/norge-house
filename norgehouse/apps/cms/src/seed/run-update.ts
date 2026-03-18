import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { localize } from './localize'
import { uploadImages } from './upload-images'

const run = async () => {
  console.log('Starting content update...\n')
  const payload = await getPayload({ config })

  // Step 1: Upload images
  console.log('=== Step 1: Upload Images ===')
  await uploadImages(payload)

  // Step 2: Localize content
  console.log('\n=== Step 2: Localize Content ===')
  await localize(payload)

  console.log('\n========================================')
  console.log('Content update complete!')
  console.log('========================================')
  process.exit(0)
}

run().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
