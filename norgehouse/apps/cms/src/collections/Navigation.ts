import type { CollectionConfig } from 'payload'

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  labels: {
    singular: 'Navigation',
    plural: 'Navigation',
  },
  admin: {
    useAsTitle: 'locale',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'locale',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Latvian', value: 'lv' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'children',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
