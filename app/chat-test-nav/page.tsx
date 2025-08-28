import { Suspense } from 'react'
import ChatTestNavClient from './chat-test-nav-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ChatTestNavPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatTestNavClient />
    </Suspense>
  )
}
