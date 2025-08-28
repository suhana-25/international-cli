import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Nitesh Handicraft',
  description: 'Our handicraft services',
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Services</h1>
      <p className="text-gray-600">Our handicraft services will be available here soon.</p>
    </div>
  )
}
