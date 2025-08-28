import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function BlogDeletePageContent() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Delete Blog Post</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-red-600">🗑️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Post Deletion</h3>
          <p className="text-gray-600">Blog post deletion functionality will be available here soon.</p>
        </div>
      </div>
    </div>
  )
}

export default function BlogDeletePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogDeletePageContent />
    </Suspense>
  )
} 