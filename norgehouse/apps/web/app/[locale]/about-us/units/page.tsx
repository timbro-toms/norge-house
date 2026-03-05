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
    description: 'Technical details about the structural units used in Norge House timber-frame homes.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/about-us/units/`,
      languages: buildHreflangAlternates('about-us/units'),
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
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
