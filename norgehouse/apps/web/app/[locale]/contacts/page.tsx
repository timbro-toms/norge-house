import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/payload'
import { buildHreflangAlternates } from '@/lib/utils'
import { ContactFormBlock } from '@/components/blocks/ContactFormBlock'
import { MapBlock } from '@/components/blocks/MapBlock'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Contacts | Norge House',
    description: 'Get in touch with Norge House SIA. Timber-frame prefab house manufacturer based in Cēsis, Latvia.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/contacts/`,
      languages: buildHreflangAlternates('contacts'),
    },
  }
}

export default async function ContactsPage({ params }: Props) {
  const settings = await getSiteSettings(params.locale)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings?.companyName || 'Norge House SIA',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gaujas iela 29',
      addressLocality: 'Cēsis',
      postalCode: 'LV-4101',
      addressCountry: 'LV',
    },
    telephone: settings?.phone,
    email: settings?.email,
    url: 'https://norgehouse.com',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 57.3119,
      longitude: 25.2748,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Contact Us</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Get in touch with our team for inquiries, quotes, or partnership opportunities.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ContactFormBlock
              block={{
                heading: 'Send us a message',
                formType: 'general',
                successMessage: 'Thank you! We will get back to you shortly.',
              }}
            />
          </div>
          <div>
            <div className="bg-brand-light rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Company Details</h2>
              <div className="space-y-4 text-brand-muted">
                <div>
                  <p className="font-semibold text-brand-dark">{settings?.companyName || 'Norge House SIA'}</p>
                  <p>{settings?.address || 'Gaujas iela 29, Cēsis, LV-4101, Latvia'}</p>
                </div>
                {settings?.phone && (
                  <div>
                    <p className="font-semibold text-brand-dark">Phone</p>
                    <a href={`tel:${settings.phone}`} className="hover:text-brand-primary transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                )}
                {settings?.email && (
                  <div>
                    <p className="font-semibold text-brand-dark">Email</p>
                    <a href={`mailto:${settings.email}`} className="hover:text-brand-primary transition-colors">
                      {settings.email}
                    </a>
                  </div>
                )}
                {settings?.vatNumber && (
                  <div>
                    <p className="font-semibold text-brand-dark">VAT Number</p>
                    <p>{settings.vatNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <MapBlock
              block={{
                heading: 'Our Location',
                embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2161.0!2d25.2748!3d57.3119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTfCsDE4JzQyLjgiTiAyNcKwMTYnMjkuMyJF!5e0!3m2!1sen!2slv!4v1',
                address: 'Gaujas iela 29, Cēsis, Latvia',
                zoom: 14,
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
