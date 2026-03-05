import type { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Norge House',
    description: 'Norge House SIA privacy policy and data protection information.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/contacts/privacy-policy/`,
      languages: buildHreflangAlternates('contacts/privacy-policy'),
    },
  }
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const page = await getPage('privacy-policy', params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Privacy Policy</h1>
        </div>
      </section>
      <section className="container-page py-16 max-w-3xl mx-auto">
        {page?.sections ? (
          <BlockRenderer blocks={page.sections} />
        ) : (
          <div className="prose">
            <p className="text-brand-muted">Privacy policy content is managed in the CMS.</p>
          </div>
        )}
      </section>
    </>
  )
}
