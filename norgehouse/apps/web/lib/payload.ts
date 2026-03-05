const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'

interface PaginatedDocs<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface MediaItem {
  id: string
  url: string
  alt: string
  caption?: string
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
    hero?: { url: string; width: number; height: number }
    square?: { url: string; width: number; height: number }
  }
}

interface Page {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  hero?: {
    heading?: string
    subheading?: string
    backgroundImage?: MediaItem
    ctaLabel?: string
    ctaHref?: string
    variant?: 'fullscreen' | 'compact' | 'split'
  }
  sections?: Block[]
  meta?: { title?: string; description?: string; image?: MediaItem }
  updatedAt: string
}

interface Project {
  id: string
  title: string
  slug: string
  coverImage: MediaItem
  gallery?: { image: MediaItem; caption?: string }[]
  description?: unknown
  location?: string
  country?: string
  year?: number
  areaSqm?: number
  rooms?: number
  levels?: number
  livingArea?: number
  garageArea?: number
  cubicCapacity?: number
  height?: number
  roofSlope?: number
  price?: number
  priceNote?: string
  houseType?: string
  featured?: boolean
  publishedAt?: string
  meta?: { title?: string; description?: string; image?: MediaItem }
  updatedAt: string
}

interface NewsArticle {
  id: string
  title: string
  slug: string
  coverImage?: MediaItem
  excerpt?: string
  content: unknown
  author?: string
  publishedAt: string
  tags?: { tag: string }[]
  status: 'draft' | 'published'
  meta?: { title?: string; description?: string; image?: MediaItem }
  updatedAt: string
}

interface Gallery {
  id: string
  title: string
  slug: string
  coverImage?: MediaItem
  images?: { image: MediaItem; caption?: string }[]
  category?: string
  order?: number
}

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

interface Navigation {
  id: string
  locale: string
  items: NavItem[]
}

interface SiteSettings {
  companyName?: string
  tagline?: string
  phone?: string
  phoneSecondary?: string
  email?: string
  address?: string
  vatNumber?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  defaultOgImage?: MediaItem
  googleAnalyticsId?: string
  plausibleDomain?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

async function fetchPayload<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${PAYLOAD_URL}/api${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Payload fetch failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getPage(slug: string, locale: string): Promise<Page | null> {
  const data = await fetchPayload<PaginatedDocs<Page>>('/pages', {
    where: JSON.stringify({ slug: { equals: slug }, status: { equals: 'published' } }),
    locale,
    limit: '1',
    depth: '2',
  })
  return data.docs[0] || null
}

export async function getProjects(
  locale: string,
  options?: { limit?: number; page?: number; featured?: boolean },
): Promise<PaginatedDocs<Project>> {
  const where: Record<string, unknown> = {}
  if (options?.featured) {
    where.featured = { equals: true }
  }

  return fetchPayload<PaginatedDocs<Project>>('/projects', {
    locale,
    limit: String(options?.limit || 12),
    page: String(options?.page || 1),
    sort: '-publishedAt',
    depth: '1',
    ...(Object.keys(where).length > 0 && { where: JSON.stringify(where) }),
  })
}

export async function getProject(slug: string, locale: string): Promise<Project | null> {
  const data = await fetchPayload<PaginatedDocs<Project>>('/projects', {
    where: JSON.stringify({ slug: { equals: slug } }),
    locale,
    limit: '1',
    depth: '2',
  })
  return data.docs[0] || null
}

export async function getNews(
  locale: string,
  options?: { limit?: number; page?: number; tag?: string },
): Promise<PaginatedDocs<NewsArticle>> {
  const where: Record<string, unknown> = { status: { equals: 'published' } }
  if (options?.tag) {
    where['tags.tag'] = { equals: options.tag }
  }

  return fetchPayload<PaginatedDocs<NewsArticle>>('/news', {
    locale,
    limit: String(options?.limit || 9),
    page: String(options?.page || 1),
    sort: '-publishedAt',
    depth: '1',
    where: JSON.stringify(where),
  })
}

export async function getArticle(slug: string, locale: string): Promise<NewsArticle | null> {
  const data = await fetchPayload<PaginatedDocs<NewsArticle>>('/news', {
    where: JSON.stringify({ slug: { equals: slug }, status: { equals: 'published' } }),
    locale,
    limit: '1',
    depth: '2',
  })
  return data.docs[0] || null
}

export async function getGalleries(locale: string): Promise<Gallery[]> {
  const data = await fetchPayload<PaginatedDocs<Gallery>>('/galleries', {
    locale,
    limit: '100',
    sort: 'order',
    depth: '1',
  })
  return data.docs
}

export async function getNavigation(locale: string): Promise<Navigation | null> {
  const data = await fetchPayload<PaginatedDocs<Navigation>>('/navigation', {
    where: JSON.stringify({ locale: { equals: locale } }),
    limit: '1',
    depth: '0',
  })
  return data.docs[0] || null
}

export async function getSiteSettings(locale: string): Promise<SiteSettings | null> {
  try {
    return await fetchPayload<SiteSettings>('/globals/site-settings', { locale })
  } catch {
    return null
  }
}

export async function getAllProjectSlugs(): Promise<{ slug: string; locale: string }[]> {
  const data = await fetchPayload<PaginatedDocs<{ slug: string }>>('/projects', {
    limit: '1000',
    depth: '0',
  })
  const locales = ['en', 'lv', 'de', 'it']
  return data.docs.flatMap((doc) => locales.map((locale) => ({ slug: doc.slug, locale })))
}

export async function getAllNewsSlugs(): Promise<{ slug: string; locale: string }[]> {
  const data = await fetchPayload<PaginatedDocs<{ slug: string }>>('/news', {
    where: JSON.stringify({ status: { equals: 'published' } }),
    limit: '1000',
    depth: '0',
  })
  const locales = ['en', 'lv', 'de', 'it']
  return data.docs.flatMap((doc) => locales.map((locale) => ({ slug: doc.slug, locale })))
}

export type { Page, Project, NewsArticle, Gallery, Navigation, NavItem, SiteSettings, MediaItem, Block, PaginatedDocs }
