import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getAllProjectSlugs } from '@/lib/payload'
import { buildHreflangAlternates, getMediaUrl } from '@/lib/utils'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map(({ slug, locale }) => ({ slug, locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug, params.locale)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.meta?.title || project.title} | Norge House`,
    description: project.meta?.description || `${project.title} - ${project.location}`,
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/projects/${params.slug}/`,
      languages: buildHreflangAlternates(`projects/${params.slug}`),
    },
    openGraph: {
      title: project.meta?.title || project.title,
      description: project.meta?.description,
      images: project.coverImage?.url
        ? [{ url: getMediaUrl(project.coverImage.url), width: 1200, height: 630 }]
        : [],
      locale: params.locale,
      type: 'website',
      siteName: 'Norge House',
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug, params.locale)
  if (!project) notFound()

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] flex items-end bg-brand-dark">
        {project.coverImage?.url && (
          <div className="absolute inset-0">
            <Image
              src={getMediaUrl(project.coverImage.url)}
              alt={project.coverImage.alt || project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        )}
        <div className="relative z-10 container-page pb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{project.title}</h1>
          {project.price && (
            <div className="text-2xl font-bold text-brand-primary mb-4">
              €{project.price.toLocaleString()}
              {project.priceNote && <span className="text-sm text-white/70 font-normal ml-2">{project.priceNote}</span>}
            </div>
          )}
          <div className="flex flex-wrap gap-6 text-lg opacity-90">
            {project.areaSqm && <span>{project.areaSqm} m²</span>}
            {project.rooms && <span>{project.rooms} rooms</span>}
            {project.levels && <span>{project.levels === 1 ? '1 level' : `${project.levels} levels`}</span>}
            {project.houseType && <span className="capitalize">{project.houseType.replace('-', ' ')}</span>}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        {/* Specifications table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {project.livingArea && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.livingArea} m²</div>
              <div className="text-sm text-brand-muted">Living Area</div>
            </div>
          )}
          {project.areaSqm && project.areaSqm !== project.livingArea && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.areaSqm} m²</div>
              <div className="text-sm text-brand-muted">Total Area</div>
            </div>
          )}
          {project.garageArea && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.garageArea} m²</div>
              <div className="text-sm text-brand-muted">Garage</div>
            </div>
          )}
          {project.rooms && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.rooms}</div>
              <div className="text-sm text-brand-muted">Rooms</div>
            </div>
          )}
          {project.levels && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.levels}</div>
              <div className="text-sm text-brand-muted">{project.levels === 1 ? 'Level' : 'Levels'}</div>
            </div>
          )}
          {project.cubicCapacity && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.cubicCapacity} m³</div>
              <div className="text-sm text-brand-muted">Volume</div>
            </div>
          )}
          {project.height && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.height} m</div>
              <div className="text-sm text-brand-muted">Height</div>
            </div>
          )}
          {project.roofSlope != null && (
            <div className="bg-brand-light rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-dark">{project.roofSlope}°</div>
              <div className="text-sm text-brand-muted">Roof Slope</div>
            </div>
          )}
        </div>

        {project.description && (
          <div className="prose max-w-3xl mb-12">
            {/* Rich text content would be rendered with a serializer */}
            <p className="text-brand-muted text-lg leading-relaxed">
              {typeof project.description === 'string' ? project.description : 'Project details coming soon.'}
            </p>
          </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-bold mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((item, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  {item.image?.url && (
                    <Image
                      src={getMediaUrl(item.image.url)}
                      alt={item.caption || item.image.alt || `Gallery image ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Link
            href={`/${params.locale}/projects`}
            className="inline-flex items-center text-brand-primary hover:underline font-semibold"
          >
            &larr; Back to Projects
          </Link>
        </div>
      </section>
    </>
  )
}
