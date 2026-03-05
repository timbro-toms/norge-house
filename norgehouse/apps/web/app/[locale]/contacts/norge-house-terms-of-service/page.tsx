import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Terms of Service | Norge House',
    description: 'Norge House SIA terms of service and conditions.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/contacts/norge-house-terms-of-service/`,
      languages: buildHreflangAlternates('contacts/norge-house-terms-of-service'),
    },
  }
}

export default async function TermsOfServicePage({ params }: Props) {
  const page = await getPage('terms-of-service', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Terms of Service</h1>
        </div>
      </section>
      <section className="container-page py-16 max-w-3xl mx-auto">
        {page?.sections ? (
          <BlockRenderer blocks={page.sections} />
        ) : (
          <div className="prose">
            <p className="text-brand-muted">Terms of service content is managed in the CMS.</p>
          </div>
        )}
      </section>
    </>
  )
}
