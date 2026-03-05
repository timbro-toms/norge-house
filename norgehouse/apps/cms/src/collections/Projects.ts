import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'year', 'featured', 'updatedAt'],
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'areaSqm',
      type: 'number',
      label: 'Area (m²)',
    },
    {
      name: 'houseType',
      type: 'select',
      options: [
        { label: 'Single Storey', value: 'single-storey' },
        { label: 'Two Storey', value: 'two-storey' },
        { label: 'Module', value: 'module' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on homepage',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
