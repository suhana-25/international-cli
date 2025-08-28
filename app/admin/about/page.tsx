import { Metadata } from 'next'
// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import { redirect } from 'next/navigation'
import { APP_NAME } from '@/lib/constants'
import AboutForm from './about-form'

export const metadata: Metadata = {
  title: `About Us Management - ${APP_NAME}`,
}

export default async function AboutManagementPage() {
  const session = null // Skip auth check - using custom auth system
  
  // if (!session?.user?.id || // session?.user.role !== 'admin') {
//     redirect('/auth/sign-in')
//   }

  return (
    <div className="wrapper py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">About Us Content Management</h1>
          <p className="text-muted-foreground">
            Manage the content that will be displayed on the public about us page.
          </p>
        </div>
        
        <AboutForm />
      </div>
    </div>
  )
} 

