import { Suspense } from 'react'
import { getAllUsers } from '@/lib/actions/user.actions'
import { adminOnly } from '@/lib/server-utils'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import UserManagementClient from './user-management-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const metadata: Metadata = {
  title: `${APP_NAME} - User Management`,
  description: 'Manage all users with advanced controls',
}

// Force dynamic rendering to show latest user data
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function AdminUsersPageContent({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>
}) {
  const params = await searchParams
  await adminOnly()
  
  // Get users from database
  const users = await getAllUsers({
    page: parseInt(params.page) || 1,
    limit: 50
  })

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-slate-400">
              Manage user roles, permissions, and account settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Total Users: {users?.data?.length || 0}
            </div>
          </div>
        </div>

        <UserManagementClient 
          currentAdminId="admin" 
          initialUsers={{
            data: users?.data || [],
            totalPages: users?.totalPages || 1,
            currentPage: parseInt(params.page) || 1,
            totalUsers: users?.data?.length || 0
          }}
        />
      </div>
    </div>
  )
}

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminUsersPageContent searchParams={searchParams} />
    </Suspense>
  )
}
