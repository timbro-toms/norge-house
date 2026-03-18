import type { Metadata } from 'next'
import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export const generateMetadata = (): Promise<Metadata> =>
  generatePageMetadata({ config, params: Promise.resolve({ segments: ['not-found'] }), searchParams: Promise.resolve({}) })

const NotFound = () => NotFoundPage({ config, importMap, params: Promise.resolve({ segments: ['not-found'] }), searchParams: Promise.resolve({}) })

export default NotFound
