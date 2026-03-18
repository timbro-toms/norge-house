import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Materials | Norge House',
    description: 'High-quality certified materials used in Norge House timber-frame construction — wood, insulation, OSB, membranes and more.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/materials/`,
      languages: buildHreflangAlternates('materials'),
    },
  }
}

export default async function MaterialsPage({ params }: Props) {
  const page = await getPage('materials', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Materials</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Certified, high-quality materials for lasting performance and energy efficiency.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
