import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProjects } from '@/lib/payload'
import { buildHreflangAlternates, getMediaUrl } from '@/lib/utils'

interface Props {
  params: { locale: string }
  searchParams: { page?: string; type?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Projects | Norge House',
    description: 'Explore our completed timber-frame house projects across Europe.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/projects/`,
      languages: buildHreflangAlternates('projects'),
    },
    openGraph: {
      title: 'Projects | Norge House',
      description: 'Explore our completed timber-frame house projects across Europe.',
      locale: params.locale,
      type: 'website',
      siteName: 'Norge House',
    },
  }
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const currentPage = Number(searchParams.page) || 1
  const data = await getProjects(params.locale, { page: currentPage, limit: 12 })

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: data.docs.map((project, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: project.title,
      url: `https://norgehouse.com/${params.locale}/projects/${project.slug}/`,
      image: getMediaUrl(project.coverImage?.url),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Projects</h1>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.docs.map((project) => (
            <Link
              key={project.id}
              href={`/${params.locale}/projects/${project.slug}`}
              className="group block rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {project.coverImage?.url && (
                  <Image
                    src={getMediaUrl(project.coverImage.url)}
                    alt={project.coverImage.alt || project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-brand-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-brand-muted">
                  {project.location && <span>{project.location}</span>}
                  {project.areaSqm && <span>{project.areaSqm} m²</span>}
                  {project.year && <span>{project.year}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/${params.locale}/projects?page=${page}`}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-brand-primary text-brand-dark font-semibold'
                    : 'bg-brand-light text-brand-muted hover:bg-brand-primary/20'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
