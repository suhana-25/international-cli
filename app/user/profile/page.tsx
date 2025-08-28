import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { APP_NAME } from '@/lib/constants'

import ProfileForm from './profile-form'

export const metadata: Metadata = {
  title: `Customer Profile - ${APP_NAME}`,
}

export default async function ProfilePage() {
  // Check auth with custom system - redirect if not signed in
  // For now skip auth check
  return (
    <div className="max-w-md  mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfileForm />
    </div>
  )
}
