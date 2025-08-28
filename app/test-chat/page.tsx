import { Suspense } from 'react'
import TestChatClient from './test-chat-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TestChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TestChatClient />
    </Suspense>
  )
}
