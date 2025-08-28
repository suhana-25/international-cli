import { Suspense } from 'react'
import AdminLayoutClient from './admin-layout-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { adminOnly } from '@/lib/server-utils'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure user is authenticated and has admin role
  await adminOnly()
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </Suspense>
  )
}
