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
    description: 'High-quality materials used in the construction of Norge House timber-frame homes.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/about-us/materials/`,
      languages: buildHreflangAlternates('about-us/materials'),
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
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
