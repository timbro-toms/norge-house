import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage('home', params.locale)
  if (!page) return { title: 'Norge House' }

  return {
    title: `${page.meta?.title || page.title} | Norge House`,
    description: page.meta?.description || 'Latvian timber-frame prefab house manufacturer',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/home/`,
      languages: buildHreflangAlternates('home'),
    },
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      images: page.meta?.image?.url ? [{ url: page.meta.image.url, width: 1200, height: 630 }] : [],
      locale: params.locale,
      type: 'website',
      siteName: 'Norge House',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function HomePage({ params }: Props) {
  const page = await getPage('home', params.locale)

  if (!page) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Norge House</h1>
        <p className="text-brand-muted text-lg">
          Quality timber-frame prefab houses from Latvia.
        </p>
      </div>
    )
  }

  return (
    <>
      {page.hero && (
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center bg-brand-dark">
          {page.hero.backgroundImage?.url && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${page.hero.backgroundImage.url})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          <div className="relative z-10 text-center text-white px-4">
            {page.hero.heading && (
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                {page.hero.heading}
              </h1>
            )}
            {page.hero.subheading && (
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                {page.hero.subheading}
              </p>
            )}
            {page.hero.ctaLabel && page.hero.ctaHref && (
              <a
                href={page.hero.ctaHref}
                className="inline-block bg-brand-primary text-brand-dark font-semibold px-8 py-3 rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                {page.hero.ctaLabel}
              </a>
            )}
          </div>
        </section>
      )}
      {page.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
