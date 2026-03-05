'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

interface TextImageBlockProps {
  block: {
    heading?: string
    body?: unknown
    image?: { url?: string; alt?: string }
    imagePosition?: 'left' | 'right'
    backgroundColor?: string
    ctaLabel?: string
    ctaHref?: string
  }
}

export function TextImageBlock({ block }: TextImageBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isImageLeft = block.imagePosition === 'left'

  return (
    <section
      ref={ref}
      className="py-16"
      style={block.backgroundColor ? { backgroundColor: block.backgroundColor } : undefined}
    >
      <div className={`container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
        isVisible ? 'animate-fade-in' : 'opacity-0'
      }`}>
        <div className={isImageLeft ? 'lg:order-2' : ''}>
          {block.heading && (
            <h2 className="text-3xl font-heading font-bold mb-6">{block.heading}</h2>
          )}
          <div className="prose text-brand-muted leading-relaxed">
            {typeof block.body === 'string' ? <p>{block.body}</p> : <p>Content from CMS.</p>}
          </div>
          {block.ctaLabel && block.ctaHref && (
            <a
              href={block.ctaHref}
              className="inline-block mt-6 bg-brand-primary text-brand-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              {block.ctaLabel}
            </a>
          )}
        </div>
        <div className={`relative aspect-[4/3] rounded-lg overflow-hidden ${isImageLeft ? 'lg:order-1' : ''}`}>
          {block.image?.url && (
            <Image
              src={getMediaUrl(block.image.url)}
              alt={block.image.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </div>
      </div>
    </section>
  )
}
