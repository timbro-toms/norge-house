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
      { source: '/', destination: '/en/home', permanent: true },
      { source: '/en', destination: '/en/home', permanent: true },
      { source: '/lv', destination: '/lv/sakums', permanent: true },
      { source: '/de', destination: '/de/home', permanent: true },
      { source: '/it', destination: '/it/home', permanent: true },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
