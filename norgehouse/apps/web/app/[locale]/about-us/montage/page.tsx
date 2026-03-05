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
    description: 'Learn about the on-site assembly and montage process for Norge House timber-frame homes.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/about-us/montage/`,
      languages: buildHreflangAlternates('about-us/montage'),
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
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
