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
    description: 'Complete timber-frame house manufacturing kit components — walls, floors, roofing, windows and doors.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/manufacturing-kit/`,
      languages: buildHreflangAlternates('manufacturing-kit'),
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
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Everything included in our timber-frame house construction package.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
