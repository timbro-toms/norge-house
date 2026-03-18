import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { localize } from './localize'

const run = async () => {
  console.log('Starting localization...')
  const payload = await getPayload({ config })
  console.log('Payload initialized, running localization...')
  await localize(payload)
  console.log('Localization complete!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Localization failed:', err)
  process.exit(1)
})
