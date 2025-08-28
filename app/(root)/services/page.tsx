import { Suspense } from 'react'
import { Metadata } from 'next'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Services - Nitesh Handicraft',
  description: 'Our handicraft services',
}

function ServicesPageContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Services</h1>
      <p className="text-gray-600">Our handicraft services will be available here soon.</p>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ServicesPageContent />
    </Suspense>
  )
}
