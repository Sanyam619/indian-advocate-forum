/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in development to avoid cache issues
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/judges',
        destination: '/judges/current',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig