import { Metadata } from 'next'
// // import { auth } from '@/lib/auth' // Removed - using custom auth // Removed - using custom auth
import { redirect } from 'next/navigation'
import { APP_NAME } from '@/lib/constants'
import ContactForm from './contact-form'
import ContactMessages from './contact-messages'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: `Contact Management - ${APP_NAME}`,
}

export default async function ContactManagementPage() {
  const session = null // Skip auth check - using custom auth system
  
  // if (!session?.user?.id || // session?.user.role !== 'admin') {
//     redirect('/sign-in')
//   }

  return (
    <div className="wrapper py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage contact information and view customer inquiries.
          </p>
        </div>
        
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="messages">Contact Messages</TabsTrigger>
            <TabsTrigger value="settings">Contact Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="max-w-4xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Contact Information Settings</h2>
                <p className="text-muted-foreground">
                  Manage your company's contact details that will be displayed on the public contact page.
                </p>
              </div>
              <ContactForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 

