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
      name: 'rooms',
      type: 'number',
      label: 'Rooms',
    },
    {
      name: 'levels',
      type: 'number',
      label: 'Levels',
      defaultValue: 1,
    },
    {
      name: 'livingArea',
      type: 'number',
      label: 'Living Area (m²)',
    },
    {
      name: 'garageArea',
      type: 'number',
      label: 'Garage Area (m²)',
    },
    {
      name: 'cubicCapacity',
      type: 'number',
      label: 'Cubic Capacity (m³)',
    },
    {
      name: 'height',
      type: 'number',
      label: 'Height (m)',
    },
    {
      name: 'roofSlope',
      type: 'number',
      label: 'Roof Slope (°)',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Manufacturing Kit Price (€)',
    },
    {
      name: 'priceNote',
      type: 'text',
      label: 'Price Note',
      localized: true,
      admin: {
        description: 'e.g. "excl. VAT" or "from"',
      },
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
