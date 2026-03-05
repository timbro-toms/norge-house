import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Production | Norge House',
    description: 'Learn about our timber-frame house production process and manufacturing facility in Cēsis, Latvia.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/production/`,
      languages: buildHreflangAlternates('production'),
    },
  }
}

export default async function ProductionPage({ params }: Props) {
  const page = await getPage('production', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Production</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Our state-of-the-art manufacturing facility in Cēsis, Latvia.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
