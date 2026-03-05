import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'subheading',
          type: 'text',
          localized: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaHref',
          type: 'text',
        },
        {
          name: 'variant',
          type: 'select',
          options: [
            { label: 'Fullscreen', value: 'fullscreen' },
            { label: 'Compact', value: 'compact' },
            { label: 'Split', value: 'split' },
          ],
          defaultValue: 'fullscreen',
        },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: allBlocks,
    },
  ],
}
