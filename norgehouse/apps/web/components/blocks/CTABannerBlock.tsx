'use client'

import { getMediaUrl } from '@/lib/utils'

interface CTABannerBlockProps {
  block: {
    heading: string
    subheading?: string
    ctaLabel?: string
    ctaHref?: string
    backgroundColor?: string
    backgroundImage?: { url?: string }
    variant?: 'solid' | 'image-overlay'
  }
}

export function CTABannerBlock({ block }: CTABannerBlockProps) {
  const isImageOverlay = block.variant === 'image-overlay' && block.backgroundImage?.url

  return (
    <section
      className="relative py-20"
      style={
        isImageOverlay
          ? { backgroundImage: `url(${getMediaUrl(block.backgroundImage?.url)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundColor: block.backgroundColor || '#c8922a' }
      }
    >
      {isImageOverlay && <div className="absolute inset-0 bg-black/50" />}
      <div className="container-page relative z-10 text-center">
        <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${isImageOverlay ? 'text-white' : 'text-brand-dark'}`}>
          {block.heading}
        </h2>
        {block.subheading && (
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${isImageOverlay ? 'text-white/90' : 'text-brand-dark/80'}`}>
            {block.subheading}
          </p>
        )}
        {block.ctaLabel && block.ctaHref && (
          <a
            href={block.ctaHref}
            className={`inline-block font-semibold px-8 py-3 rounded-lg transition-colors ${
              isImageOverlay
                ? 'bg-brand-primary text-brand-dark hover:bg-brand-primary/90'
                : 'bg-brand-dark text-white hover:bg-brand-dark/90'
            }`}
          >
            {block.ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
