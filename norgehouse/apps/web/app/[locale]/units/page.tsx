import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Units | Norge House',
    description: 'Wall unit construction diagrams and specifications for Norge House timber-frame buildings.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/units/`,
      languages: buildHreflangAlternates('units'),
    },
  }
}

export default async function UnitsPage({ params }: Props) {
  const page = await getPage('units', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Units</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Wall, floor and roof construction units included in the manufacturing kit.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
