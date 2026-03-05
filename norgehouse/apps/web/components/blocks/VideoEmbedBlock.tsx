'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

interface VideoEmbedBlockProps {
  block: {
    heading?: string
    videoUrl: string
    platform?: 'youtube' | 'vimeo'
    posterImage?: { url?: string; alt?: string }
    caption?: string
  }
}

function getEmbedUrl(url: string, platform?: string): string {
  if (platform === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : url
  }
  // Default: YouTube
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

export function VideoEmbedBlock({ block }: VideoEmbedBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const embedUrl = getEmbedUrl(block.videoUrl, block.platform)

  return (
    <section className="py-16">
      <div className="container-page max-w-4xl mx-auto">
        {block.heading && (
          <h2 className="text-3xl font-heading font-bold text-center mb-10">{block.heading}</h2>
        )}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-dark">
          {!isPlaying && block.posterImage?.url ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full group"
              aria-label="Play video"
            >
              <Image
                src={getMediaUrl(block.posterImage.url)}
                alt={block.posterImage.alt || 'Video thumbnail'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <iframe
              src={`${embedUrl}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={block.heading || 'Video'}
            />
          )}
        </div>
        {block.caption && (
          <p className="mt-4 text-center text-brand-muted text-sm">{block.caption}</p>
        )}
      </div>
    </section>
  )
}
