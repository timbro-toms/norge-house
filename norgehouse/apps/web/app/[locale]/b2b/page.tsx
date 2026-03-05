import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'B2B Partnership | Norge House',
    description: 'Partner with Norge House for timber-frame prefab house manufacturing and distribution across Europe.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/b2b/`,
      languages: buildHreflangAlternates('b2b'),
    },
  }
}

export default async function B2BPage({ params }: Props) {
  const page = await getPage('b2b', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">B2B Partnership</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Partner with us for high-quality timber-frame prefab house solutions.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
