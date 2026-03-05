import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Manufacturing Kit | Norge House',
    description: 'Explore our comprehensive manufacturing kit for timber-frame prefab houses.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/about-us/manufacturing-kit/`,
      languages: buildHreflangAlternates('about-us/manufacturing-kit'),
    },
  }
}

export default async function ManufacturingKitPage({ params }: Props) {
  const page = await getPage('manufacturing-kit', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Manufacturing Kit</h1>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
