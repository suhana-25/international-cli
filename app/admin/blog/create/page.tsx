import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function CreateBlogPostPageContent() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-blue-600">✏️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Post Creation</h3>
          <p className="text-gray-600">Blog post creation functionality will be available here soon.</p>
        </div>
      </div>
    </div>
  )
}

export default function CreateBlogPostPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateBlogPostPageContent />
    </Suspense>
  )
} 
