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
    
    // Disable all loaders that consume memory
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.test && rule.test.toString().includes('svg')) return false
      return true
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
}

export default nextConfig