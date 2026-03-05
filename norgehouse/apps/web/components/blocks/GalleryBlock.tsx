'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getMediaUrl } from '@/lib/utils'

interface GalleryBlockProps {
  block: {
    heading?: string
    layout?: 'masonry' | 'grid' | 'carousel'
    images?: Array<{ image: { url?: string; alt?: string }; caption?: string }>
  }
}

export function GalleryBlock({ block }: GalleryBlockProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const slides = block.images?.map((item) => ({
    src: getMediaUrl(item.image?.url),
    alt: item.image?.alt || item.caption || '',
  })) || []

  return (
    <section className="py-16">
      <div className="container-page">
        {block.heading && (
          <h2 className="text-3xl font-heading font-bold text-center mb-10">{block.heading}</h2>
        )}
        <div className={`grid gap-4 ${
          block.layout === 'grid'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2 md:grid-cols-3'
        }`}>
          {block.images?.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                block.layout === 'masonry' && idx % 3 === 0 ? 'row-span-2' : ''
              }`}
            >
              <div className={`relative ${block.layout === 'masonry' && idx % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                {item.image?.url && (
                  <Image
                    src={getMediaUrl(item.image.url)}
                    alt={item.image.alt || item.caption || `Image ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                )}
              </div>
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{item.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </section>
  )
}
