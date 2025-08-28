import { Suspense } from 'react'
import { HomePageClient } from './home-page-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering to prevent export errors
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePageClient />
    </Suspense>
  )
}
  
