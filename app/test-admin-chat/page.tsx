import { Suspense } from 'react'
import TestAdminChatClient from './test-admin-chat-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TestAdminChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TestAdminChatClient />
    </Suspense>
  )
}
