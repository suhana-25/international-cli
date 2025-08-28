import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import AdminChatClient from './admin-chat-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function AdminChatPageContent() {
  // Skip auth check for now

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Chat Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor and respond to customer inquiries in real-time
        </p>
      </div>
      <Suspense fallback={<div>Loading chat panel...</div>}>
        <AdminChatClient adminId="admin" adminName="Admin" />
      </Suspense>
    </div>
  )
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminChatPageContent />
    </Suspense>
  )
}
