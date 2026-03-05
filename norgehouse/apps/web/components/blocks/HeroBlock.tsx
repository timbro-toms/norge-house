'use client'

import { useEffect, useRef } from 'react'
import { getMediaUrl } from '@/lib/utils'

interface HeroBlockProps {
  block: {
    heading?: string
    subheading?: string
    backgroundImage?: { url?: string; alt?: string }
    videoUrl?: string
    ctaLabel?: string
    ctaHref?: string
    variant?: 'fullscreen' | 'compact' | 'split' | 'video'
  }
}

export function HeroBlock({ block }: HeroBlockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const bg = el.querySelector('[data-parallax]') as HTMLElement
      if (bg) bg.style.transform = `translateY(${scrollY * 0.3}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isCompact = block.variant === 'compact'
  const isVideo = block.variant === 'video' && block.videoUrl

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center bg-brand-dark overflow-hidden ${
        isCompact ? 'h-[50vh] min-h-[300px]' : 'h-[80vh] min-h-[500px]'
      }`}
    >
      {isVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={block.videoUrl} type="video/mp4" />
        </video>
      ) : block.backgroundImage?.url ? (
        <div
          data-parallax
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${getMediaUrl(block.backgroundImage.url)})`,
            height: '120%',
            top: '-10%',
          }}
        />
      ) : null}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        {block.heading && (
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 animate-fade-in">
            {block.heading}
          </h1>
        )}
        {block.subheading && (
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-slide-up">
            {block.subheading}
          </p>
        )}
        {block.ctaLabel && block.ctaHref && (
          <a
            href={block.ctaHref}
            className="inline-block bg-brand-primary text-brand-dark font-semibold px-8 py-3 rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            {block.ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
