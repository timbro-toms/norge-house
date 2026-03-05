import type { Metadata } from 'next'
import Image from 'next/image'
import { getGalleries } from '@/lib/payload'
import { buildHreflangAlternates, getMediaUrl } from '@/lib/utils'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Galleries | Norge House',
    description: 'Browse photo galleries of our timber-frame houses, production process, and completed projects.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/galleries/`,
      languages: buildHreflangAlternates('galleries'),
    },
  }
}

export default async function GalleriesPage({ params }: Props) {
  const galleries = await getGalleries(params.locale)

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Galleries</h1>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="rounded-lg overflow-hidden bg-white shadow-md">
              <div className="relative aspect-[4/3]">
                {gallery.coverImage?.url && (
                  <Image
                    src={getMediaUrl(gallery.coverImage.url)}
                    alt={gallery.coverImage.alt || gallery.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg">{gallery.title}</h3>
                {gallery.images && (
                  <p className="text-sm text-brand-muted mt-1">{gallery.images.length} photos</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {galleries.length === 0 && (
          <p className="text-center text-brand-muted text-lg py-12">No galleries found.</p>
        )}
      </section>
    </>
  )
}
