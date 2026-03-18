import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { populateContent } from './populate-content'

const run = async () => {
  console.log('Starting content population...')
  const payload = await getPayload({ config })
  console.log('Payload initialized, populating content...')
  await populateContent(payload)
  console.log('Done!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Population failed:', err)
  process.exit(1)
})
