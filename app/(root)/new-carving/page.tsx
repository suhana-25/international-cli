import { Suspense } from 'react'
import { Metadata } from 'next'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'New Carving - Nitesh Handicraft',
  description: 'Explore our latest carving collection',
}

function NewCarvingPageContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Carving Collection</h1>
      <p className="text-gray-600">Our latest carving designs will be available here soon.</p>
    </div>
  )
}

export default function NewCarvingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewCarvingPageContent />
    </Suspense>
  )
}
