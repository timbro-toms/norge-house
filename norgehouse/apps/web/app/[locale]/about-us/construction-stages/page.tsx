import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Construction Stages | Norge House',
    description: 'Step-by-step guide through the construction stages of a Norge House timber-frame home.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/about-us/construction-stages/`,
      languages: buildHreflangAlternates('about-us/construction-stages'),
    },
  }
}

export default async function ConstructionStagesPage({ params }: Props) {
  const page = await getPage('construction-stages', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Construction Stages</h1>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
