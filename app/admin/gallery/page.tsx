import { Suspense } from 'react'
import GalleryClient from './gallery-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminGalleryPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GalleryClient />
    </Suspense>
  )
}
