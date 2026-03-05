import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'About Us | Norge House',
    description: 'Norge House SIA — Latvian timber-frame prefab house manufacturer based in Cēsis, Latvia.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/about-us/`,
      languages: buildHreflangAlternates('about-us'),
    },
  }
}

export default async function AboutUsPage({ params }: Props) {
  const page = await getPage('about-us', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">About Us</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Quality Scandinavian-style timber-frame houses, manufactured in Latvia.
          </p>
        </div>
      </section>
      {page?.sections && <BlockRenderer blocks={page.sections} />}
    </>
  )
}
