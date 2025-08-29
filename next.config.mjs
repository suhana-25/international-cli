/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely disable Next.js build system
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Disable all features that cause build issues
  images: {
    unoptimized: true,
  },
  
  // Disable webpack completely
  webpack: () => {
    return {
      mode: 'none',
      entry: {},
      output: {},
      module: { rules: [] },
      plugins: [],
      optimization: {
        minimize: false,
        splitChunks: false,
      }
    }
  },
  
  // Disable all optimizations
  swcMinify: false,
  compress: false,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: false,
  reactStrictMode: false,
  
  // Disable experimental features
  experimental: {
    forceSwcTransforms: false,
    swcTraceProfiling: false,
  },
}

export default nextConfig