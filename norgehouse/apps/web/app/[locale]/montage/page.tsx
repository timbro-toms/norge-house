import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Montage | Norge House',
    description: 'Assembly process for Norge House timber-frame homes — from delivery to completed structure in days.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/montage/`,
      languages: buildHreflangAlternates('montage'),
    },
  }
}

export default async function MontagePage({ params }: Props) {
  const page = await getPage('montage', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Montage</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Fast, precise assembly — from production kit to weatherproof shell.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
