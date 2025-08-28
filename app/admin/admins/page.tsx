// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import { adminOnly } from '@/lib/server-utils'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import AdminManagementClient from './admin-management-client'

export const metadata: Metadata = {
  title: `Admin Management - ${APP_NAME}`,
}

export default async function AdminManagementPage() {
  await adminOnly()
  const session = null // Skip auth check - using custom auth system
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="h2-bold">Admin Management</h1>
        <p className="text-muted-foreground">
          Manage admin users. Only existing admins can access this page.
        </p>
      </div>
      
      <AdminManagementClient currentAdminId="admin" />
    </div>
  )
} 
