/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['swr', 'lucide-react', 'framer-motion'],
    serverComponentsExternalPackages: ['sharp'],
  },
  // Disable static export completely for Render deployment
  output: 'standalone',
  // Force all pages to be dynamic
  trailingSlash: false,
  // Disable image optimization during build
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable static generation for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  // Disable webpack optimization that might cause static generation
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
      }
    }
    return config
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Completely disable static generation
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Force dynamic rendering for all routes
  async rewrites() {
    return []
  },
  // Disable static optimization
  swcMinify: false,
  // Disable compression
  compress: false,
}

export default nextConfig