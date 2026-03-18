const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'norgehouse.com',
      },
      {
        protocol: 'https',
        hostname: 'wooden-houses.itlinden.lv',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'cms',
        port: '3001',
      },
    ],
  },
  async redirects() {
    return [
      // Root redirects
      { source: '/', destination: '/en/home', permanent: true },
      { source: '/en', destination: '/en/home', permanent: true },
      { source: '/lv', destination: '/lv/sakums', permanent: true },
      { source: '/de', destination: '/de/home', permanent: true },
      { source: '/it', destination: '/it/home', permanent: true },
      // Old site used /projects/view/:slug — redirect to new /projects/:slug
      { source: '/:locale/projects/view/:slug', destination: '/:locale/projects/:slug', permanent: true },
      // Old site used /galleries/:slug — keep compatible
      { source: '/:locale/galleries/:slug', destination: '/:locale/galleries/:slug', permanent: false },
      // Old site used /news/view/:slug — redirect to new /news/:slug
      { source: '/:locale/news/view/:slug', destination: '/:locale/news/:slug', permanent: true },
      // Old Danish locale redirect to English (we support en/lv/de/it)
      { source: '/dk/:path*', destination: '/en/:path*', permanent: true },
      // Old Dutch locale redirect to English
      { source: '/nl/:path*', destination: '/en/:path*', permanent: true },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
