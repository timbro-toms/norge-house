import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      defaultValue: 'Norge House SIA',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'phone',
      type: 'text',
      defaultValue: '+371 XXXXXXXX',
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'info@norgehouse.com',
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: 'Cēsis, Latvia',
    },
    {
      name: 'vatNumber',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'footerText',
      type: 'richText',
      localized: true,
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'googleAnalyticsId',
      type: 'text',
    },
    {
      name: 'plausibleDomain',
      type: 'text',
    },
  ],
}
