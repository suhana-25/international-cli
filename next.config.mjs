/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  output: 'standalone',
  trailingSlash: false,
  staticPageGenerationTimeout: 0,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
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
  webpack: (config, { isServer, dev }) => {
    // Ultra-extreme memory optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
      minimize: false,
      concatenateModules: false,
      moduleIds: 'named',
      chunkIds: 'named',
      removeAvailableModules: false,
      removeEmptyChunks: false,
      mergeDuplicateChunks: false,
      sideEffects: false,
      usedExports: false,
      providedExports: false,
      runtimeChunk: false,
      emitOnErrors: false,
      checkWasmTypes: false,
      mangleExports: false,
      innerGraph: false,
      realContentHash: false,
    }
    
    // Disable SWC loader completely and enable Babel
    config.module.rules = config.module.rules.map(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use = rule.use.filter(use => {
          if (use.loader && use.loader.includes('next-swc-loader')) {
            return false // Remove SWC loader
          }
          return true
        })
      }
      return rule
    })
    
    // Force Babel loader for JS/TS files
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          compact: false,
          cacheDirectory: false,
        }
      }
    })
    
    // Disable all plugins
    config.plugins = []
    
    // Disable source maps
    config.devtool = false
    
    // Disable watch options
    if (dev) {
      config.watchOptions = {
        ignored: /node_modules/,
        poll: false,
      }
    }
    
    return config
  },
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: false,
  reactStrictMode: false,
  swcMinify: false,
  compress: false,
  // Completely disable SWC to fix loader errors
  experimental: {
    forceSwcTransforms: false,
    swcTraceProfiling: false,
  },
}

export default nextConfig