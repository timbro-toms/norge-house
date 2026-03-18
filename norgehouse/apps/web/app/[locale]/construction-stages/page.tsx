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
    description: 'Step-by-step guide to building your Norge House — from project selection to finishing work.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/construction-stages/`,
      languages: buildHreflangAlternates('construction-stages'),
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
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            From project selection to a finished home — here is how we build.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
