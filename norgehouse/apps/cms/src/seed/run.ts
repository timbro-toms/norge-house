import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { seed } from './index'

const run = async () => {
  console.log('Starting seed...')
  const payload = await getPayload({ config })
  console.log('Payload initialized, running seed...')
  await seed(payload)
  console.log('Seed complete!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
