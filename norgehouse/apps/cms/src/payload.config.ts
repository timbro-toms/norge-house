import { buildConfig } from 'payload'
import sharp from 'sharp'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { News } from './collections/News'
import { Galleries } from './collections/Galleries'
import { Navigation } from './collections/Navigation'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [],
    },
    Pages,
    Projects,
    News,
    Galleries,
    Navigation,
    Media,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://norgehouse:norgehouse@localhost:5432/norgehouse',
    },
  }),
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Latvian', code: 'lv' },
      { label: 'German', code: 'de' },
      { label: 'Italian', code: 'it' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    seoPlugin({
      collections: ['pages', 'projects', 'news'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: { doc: Record<string, unknown> }) =>
        `${doc.title as string} | Norge House`,
      generateDescription: ({ doc }: { doc: Record<string, unknown> }) =>
        (doc.excerpt as string) || '',
    }),
    redirectsPlugin({
      collections: ['pages', 'projects', 'news'],
    }),
    nestedDocsPlugin({
      collections: ['pages'],
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        number: true,
        checkbox: true,
      },
    }),
  ],
  cors: [
    process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],
  typescript: {
    outputFile: '../../packages/types/payload-types.ts',
  },
  sharp,
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
})
