/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['swr', 'lucide-react', 'framer-motion'],
    serverComponentsExternalPackages: ['sharp'],
    // Disable heavy features during build
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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
  webpack: (config, { isServer, dev }) => {
    // Memory optimization for all builds
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
      minimize: false,
      concatenateModules: false,
      // Reduce memory usage
      moduleIds: 'named',
      chunkIds: 'named',
      // More aggressive memory optimization
      removeAvailableModules: false,
      removeEmptyChunks: false,
      mergeDuplicateChunks: false,
    }
    
    // Disable heavy loaders during build
    if (!dev) {
      config.module.rules.forEach((rule) => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('babel-loader')) {
              use.options = {
                ...use.options,
                compact: false,
                cacheDirectory: false,
              }
            }
          })
        }
      })
    }
    
    // Disable source maps to save memory
    config.devtool = false
    
    // Reduce memory usage in development
    if (dev) {
      config.watchOptions = {
        ignored: /node_modules/,
        poll: false,
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
  // Memory optimization
  poweredByHeader: false,
  generateEtags: false,
  // Disable source maps
  productionBrowserSourceMaps: false,
  // Disable bundle analyzer
  bundleAnalyzer: false,
}

export default nextConfig