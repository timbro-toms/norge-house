import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getNews } from '@/lib/payload'
import { buildHreflangAlternates, getMediaUrl } from '@/lib/utils'

interface Props {
  params: { locale: string }
  searchParams: { page?: string; tag?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'News & Updates | Norge House',
    description: 'Latest news and updates from Norge House timber-frame house manufacturer.',
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/news/`,
      languages: buildHreflangAlternates('news'),
    },
  }
}

export default async function NewsPage({ params, searchParams }: Props) {
  const currentPage = Number(searchParams.page) || 1
  const data = await getNews(params.locale, {
    page: currentPage,
    limit: 9,
    tag: searchParams.tag,
  })

  return (
    <>
      <section className="bg-brand-dark py-20">
        <div className="container-page text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">News & Updates</h1>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.docs.map((article) => (
            <Link
              key={article.id}
              href={`/${params.locale}/news/${article.slug}`}
              className="group block rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              {article.coverImage?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={getMediaUrl(article.coverImage.url)}
                    alt={article.coverImage.alt || article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <time className="text-sm text-brand-muted">
                  {new Date(article.publishedAt).toLocaleDateString(params.locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h3 className="font-heading font-bold text-lg mt-2 mb-2 group-hover:text-brand-primary transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-brand-muted text-sm line-clamp-3">{article.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {data.docs.length === 0 && (
          <p className="text-center text-brand-muted text-lg py-12">No articles found.</p>
        )}

        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/${params.locale}/news?page=${page}`}
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
