import { Suspense } from 'react'
import TestDbClient from './test-db-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TestDbPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TestDbClient />
    </Suspense>
  )
}
