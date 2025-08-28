// import { auth } from '@/lib/auth' // Removed - using custom auth
import BlogManagementClient from './blog-management-client'
import { adminOnly } from '@/lib/server-utils'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Blog Management - ${APP_NAME}`,
}

export default async function AdminBlogPage() {
  await adminOnly()
  
  return <BlogManagementClient />
} 
