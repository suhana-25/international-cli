import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function EditProductPageContent() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">Edit Product</h1>
          <p className="text-slate-300 font-inter">Update product information and settings</p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-blue-600">✏️</span>
          </div>
          <h3 className="text-lg font-poppins font-semibold text-white mb-2">Product Editing</h3>
          <p className="text-slate-400 font-inter">Product editing functionality will be available here soon.</p>
        </div>
      </div>
    </div>
  )
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditProductPageContent />
    </Suspense>
  )
} 