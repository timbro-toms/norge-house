'use client'

import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'

interface StepProcessBlockProps {
  block: {
    heading?: string
    variant?: 'vertical' | 'horizontal' | 'numbered'
    steps?: Array<{ number?: number; title: string; body?: string; image?: { url?: string; alt?: string } }>
  }
}

export function StepProcessBlock({ block }: StepProcessBlockProps) {
  const isHorizontal = block.variant === 'horizontal'

  return (
    <section className="py-16">
      <div className="container-page">
        {block.heading && (
          <h2 className="text-3xl font-heading font-bold text-center mb-12">{block.heading}</h2>
        )}
        <div className={isHorizontal ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' : 'max-w-3xl mx-auto space-y-12'}>
          {block.steps?.map((step, idx) => (
            <div key={idx} className={isHorizontal ? 'text-center' : 'flex gap-6'}>
              <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center font-heading font-bold text-lg ${isHorizontal ? 'mx-auto mb-4' : ''}`}>
                {step.number ?? idx + 1}
              </div>
              <div className={isHorizontal ? '' : 'flex-1'}>
                <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                {step.body && <p className="text-brand-muted text-sm">{step.body}</p>}
                {step.image?.url && (
                  <div className="relative aspect-video mt-4 rounded-lg overflow-hidden">
                    <Image
                      src={getMediaUrl(step.image.url)}
                      alt={step.image.alt || step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
