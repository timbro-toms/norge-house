import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle, getAllNewsSlugs } from '@/lib/payload'
import { buildHreflangAlternates, getMediaUrl } from '@/lib/utils'
import { RichText } from '@/components/RichText'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllNewsSlugs()
    return slugs.map(({ slug, locale }) => ({ slug, locale }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug, params.locale)
  if (!article) return { title: 'Article Not Found' }

  return {
    title: `${article.meta?.title || article.title} | Norge House`,
    description: article.meta?.description || article.excerpt,
    alternates: {
      canonical: `https://norgehouse.com/${params.locale}/news/${params.slug}/`,
      languages: buildHreflangAlternates(`news/${params.slug}`),
    },
    openGraph: {
      title: article.meta?.title || article.title,
      description: article.meta?.description || article.excerpt,
      images: article.coverImage?.url
        ? [{ url: getMediaUrl(article.coverImage.url), width: 1200, height: 630 }]
        : [],
      locale: params.locale,
      type: 'article',
      siteName: 'Norge House',
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug, params.locale)
  if (!article) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.coverImage?.url ? getMediaUrl(article.coverImage.url) : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'Norge House',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Norge House SIA',
      logo: { '@type': 'ImageObject', url: 'https://norgehouse.com/logo.png' },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article>
        {article.coverImage?.url && (
          <div className="relative h-[50vh] min-h-[300px]">
            <Image
              src={getMediaUrl(article.coverImage.url)}
              alt={article.coverImage.alt || article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="container-page py-12 max-w-3xl mx-auto">
          <div className="mb-6">
            <time className="text-brand-muted">
              {new Date(article.publishedAt).toLocaleDateString(params.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {article.author && (
              <span className="text-brand-muted"> &middot; {article.author}</span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">{article.title}</h1>

          <RichText content={article.content} className="prose max-w-none" />

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-brand-light text-brand-muted text-sm rounded-full"
                >
                  {t.tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link
              href={`/${params.locale}/news`}
              className="inline-flex items-center text-brand-primary hover:underline font-semibold"
            >
              &larr; Back to News
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
