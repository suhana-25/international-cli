import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Carving - Nitesh Handicraft',
  description: 'Explore our latest carving collection',
}

export default function NewCarvingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Carving Collection</h1>
      <p className="text-gray-600">Our latest carving designs will be available here soon.</p>
    </div>
  )
}
