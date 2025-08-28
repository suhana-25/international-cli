// import { auth } from '@/lib/auth' // Removed - using custom auth
import { Suspense } from 'react'
import BlogManagementClient from './blog-management-client'
import { adminOnly } from '@/lib/server-utils'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Blog Management - ${APP_NAME}`,
}

async function AdminBlogPageContent() {
  await adminOnly()
  
  return <BlogManagementClient />
}

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminBlogPageContent />
    </Suspense>
  )
} 
