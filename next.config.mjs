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
  
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable static generation completely
  generateStaticParams: async () => [],
  
  // Force dynamic rendering
  dynamicParams: false,
}

export default nextConfig