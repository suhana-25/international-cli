import { Suspense } from 'react'
import { BlogsClient } from './blogs-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering to prevent export errors
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Latest Blog Posts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insights, tips, and stories about handicrafts, art, and creativity
          </p>
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <BlogsClient />
        </Suspense>
      </div>
    </div>
  )
}
