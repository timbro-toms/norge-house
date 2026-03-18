import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'subheading', type: 'text', localized: true },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'videoUrl', type: 'text' },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'fullscreen',
      options: [
        { label: 'Fullscreen', value: 'fullscreen' },
        { label: 'Compact', value: 'compact' },
        { label: 'Split', value: 'split' },
        { label: 'Video', value: 'video' },
      ],
    },
  ],
}

export const TextImageBlock: Block = {
  slug: 'textImage',
  labels: { singular: 'Text + Image', plural: 'Text + Image' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'body', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    { name: 'backgroundColor', type: 'text' },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature Grid', plural: 'Feature Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'subheading', type: 'text', localized: true },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
  ],
}

export const StepProcessBlock: Block = {
  slug: 'stepProcess',
  labels: { singular: 'Step Process', plural: 'Step Processes' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Numbered', value: 'numbered' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'number', type: 'number' },
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'masonry',
      options: [
        { label: 'Masonry', value: 'masonry' },
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
  ],
}

export const CTABannerBlock: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'subheading', type: 'text', localized: true },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
    { name: 'backgroundColor', type: 'text' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'solid',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Image Overlay', value: 'image-overlay' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats', plural: 'Stats' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'label', type: 'text', localized: true },
        { name: 'suffix', type: 'text' },
        { name: 'prefix', type: 'text' },
      ],
    },
  ],
}

export const AccordionBlock: Block = {
  slug: 'accordion',
  labels: { singular: 'Accordion', plural: 'Accordions' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', localized: true },
        { name: 'answer', type: 'richText', localized: true },
      ],
    },
  ],
}

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: { singular: 'Video Embed', plural: 'Video Embeds' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'videoUrl', type: 'text', required: true },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
      ],
    },
    { name: 'posterImage', type: 'upload', relationTo: 'media' },
    { name: 'caption', type: 'text', localized: true },
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'formType',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'B2B', value: 'b2b' },
        { label: 'Quote Request', value: 'quote' },
      ],
    },
    { name: 'successMessage', type: 'text', localized: true },
  ],
}

export const MapBlock: Block = {
  slug: 'map',
  labels: { singular: 'Map', plural: 'Maps' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'embedUrl', type: 'text', required: true },
    { name: 'address', type: 'text' },
    { name: 'zoom', type: 'number', defaultValue: 14 },
  ],
}

export const ProjectsTeaserBlock: Block = {
  slug: 'projectsTeaser',
  labels: { singular: 'Projects Teaser', plural: 'Projects Teasers' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'count',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '3', value: '3' },
        { label: '6', value: '6' },
      ],
    },
    { name: 'filterFeatured', type: 'checkbox', defaultValue: true },
  ],
}

export const NewsTeaserBlock: Block = {
  slug: 'newsTeaser',
  labels: { singular: 'News Teaser', plural: 'News Teasers' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'count',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '3', value: '3' },
        { label: '6', value: '6' },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    { name: 'content', type: 'richText', localized: true },
  ],
}

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: { singular: 'Partners', plural: 'Partners' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const allBlocks: Block[] = [
  HeroBlock,
  TextImageBlock,
  FeatureGridBlock,
  StepProcessBlock,
  GalleryBlock,
  CTABannerBlock,
  StatsBlock,
  AccordionBlock,
  VideoEmbedBlock,
  ContactFormBlock,
  MapBlock,
  ProjectsTeaserBlock,
  NewsTeaserBlock,
  RichTextBlock,
  PartnersBlock,
]
