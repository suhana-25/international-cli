import { getAllUsers } from '@/lib/user-store'
import { adminOnly } from '@/lib/server-utils'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import UserManagementClient from './user-management-client'

export const metadata: Metadata = {
  title: `${APP_NAME} - User Management`,
  description: 'Manage all users with advanced controls',
}

// Force dynamic rendering to show latest user data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>
}) {
  const params = await searchParams
  await adminOnly()
  
  // Get users from file-based storage
  const users = getAllUsers({
    page: Number(params.page || '1'),
  })

  console.log('👥 Admin users page - fetched users:', users.data.length)
  console.log('👥 Admin users page - user list preview:', users.data.map((u: any) => ({ id: u.id, email: u.email, name: u.name, role: u.role })))

  return (
    <UserManagementClient 
      users={users.data} 
      currentAdminId="admin-1" 
    />
  )
}
