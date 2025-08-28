import { Metadata } from 'next'
import { adminOnly } from '@/lib/server-utils'
import { APP_NAME } from '@/lib/constants'
import CreateAdminForm from './create-admin-form'

export const metadata: Metadata = {
  title: `${APP_NAME} - Create Admin`,
  description: 'Create a new admin user',
}

export default async function CreateAdminPage() {
  await adminOnly()

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">Create Admin User</h1>
          <p className="text-slate-400 font-inter">Add a new administrator to manage the system</p>
        </div>
        <CreateAdminForm />
      </div>
    </div>
  )
}






