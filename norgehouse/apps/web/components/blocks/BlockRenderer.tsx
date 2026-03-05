'use client'

import { HeroBlock } from './HeroBlock'
import { TextImageBlock } from './TextImageBlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { StepProcessBlock } from './StepProcessBlock'
import { GalleryBlock } from './GalleryBlock'
import { CTABannerBlock } from './CTABannerBlock'
import { StatsBlock } from './StatsBlock'
import { AccordionBlock } from './AccordionBlock'
import { VideoEmbedBlock } from './VideoEmbedBlock'
import { ContactFormBlock } from './ContactFormBlock'
import { MapBlock } from './MapBlock'

interface BlockRendererProps {
  blocks: Array<{ blockType: string; [key: string]: unknown }>
}

const blockComponents: Record<string, React.ComponentType<{ block: Record<string, unknown> }>> = {
  hero: HeroBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  textImage: TextImageBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  featureGrid: FeatureGridBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  stepProcess: StepProcessBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  gallery: GalleryBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  ctaBanner: CTABannerBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  stats: StatsBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  accordion: AccordionBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  videoEmbed: VideoEmbedBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  contactForm: ContactFormBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  map: MapBlock as React.ComponentType<{ block: Record<string, unknown> }>,
  richText: ({ block }: { block: Record<string, unknown> }) => (
    <section className="container-page py-12">
      <div className="prose max-w-3xl mx-auto">
        {typeof block.content === 'string' ? <p>{block.content}</p> : null}
      </div>
    </section>
  ),
  projectsTeaser: ({ block }: { block: Record<string, unknown> }) => (
    <section className="container-page py-16">
      {block.heading && <h2 className="text-3xl font-heading font-bold text-center mb-10">{block.heading as string}</h2>}
      <p className="text-center text-brand-muted">Projects loaded dynamically from CMS.</p>
    </section>
  ),
  newsTeaser: ({ block }: { block: Record<string, unknown> }) => (
    <section className="container-page py-16">
      {block.heading && <h2 className="text-3xl font-heading font-bold text-center mb-10">{block.heading as string}</h2>}
      <p className="text-center text-brand-muted">News loaded dynamically from CMS.</p>
    </section>
  ),
  partners: ({ block }: { block: Record<string, unknown> }) => (
    <section className="container-page py-16">
      {block.heading && <h2 className="text-3xl font-heading font-bold text-center mb-10">{block.heading as string}</h2>}
      <div className="flex flex-wrap justify-center items-center gap-8">
        {Array.isArray(block.logos) &&
          block.logos.map((logo: { name?: string; image?: { url?: string }; url?: string }, idx: number) => (
            <div key={idx} className="text-center">
              {logo.url ? (
                <a href={logo.url} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-primary">
                  {logo.name}
                </a>
              ) : (
                <span className="text-brand-muted">{logo.name}</span>
              )}
            </div>
          ))}
      </div>
    </section>
  ),
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={`${block.blockType}-${index}`} block={block} />
      })}
    </>
  )
}
