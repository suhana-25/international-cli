'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { updateProfile } from '@/lib/actions/user.actions'
import { updateProfileSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
// // import { useSession } from 'next-auth/react' // Removed - using custom auth // Removed - using custom auth
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'

const ProfileForm = () => {
  // const { data: session, update } = useSession() // Removed - using custom auth
  const session = { user: { id: 'admin', name: 'Admin', email: 'admin@example.com' } } // Mock session
  const update = () => {} // Mock update function
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user.name || '',
      email: session?.user.email || '',
    },
  })
  const { toast } = useToast()

  // Update form when session changes
  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session?.user.name || '',
        email: session?.user.email || '',
      })
    }
  }, [session, form])

  const debugUser = async () => {
    try {
      const response = await fetch('/api/debug/user')
      const data = await response.json()
      console.log('Debug user data:', data)
      toast({
        description: `Check console for user data. Session: ${data.sessionUser?.name}, DB: ${data.databaseUser?.name}`,
        className: "bg-slate-800 border-slate-700 text-slate-200",
      })
    } catch (error) {
      console.error('Debug error:', error)
    }
  }

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    console.log('Submitting profile update:', values)
    
    try {
      const res = await updateProfile(values)
      console.log('Profile update response:', res)
      
      if (!res.success) {
        console.error('Profile update failed:', res.message)
        return toast({
          variant: 'destructive',
          description: res.message,
          className: "bg-red-800 border-red-700 text-red-200",
        })
      }

      console.log('Profile updated successfully, updating session...')

      // Update the session with new name
      // await update({ name: values.name }) // Removed - using custom auth
      // Custom auth update logic would go here
      
      toast({
        description: res.message,
        className: "bg-slate-800 border-slate-700 text-slate-200",
      })
      
      // Update form default values to reflect the change
      form.reset({
        name: values.name,
        email: values.email,
      })
      
      // Force browser refresh to ensure all components update
      console.log('Refreshing page to reflect changes...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      console.error('Error in profile update:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to update profile. Please try again.',
        className: "bg-red-800 border-red-700 text-red-200",
      })
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-poppins font-semibold text-white mb-6">Update Profile</h2>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <label className="text-slate-200 font-inter text-sm font-medium">Email Address</label>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    {...field}
                    className="bg-slate-800/50 border-slate-700 text-slate-400 placeholder:text-slate-500 cursor-not-allowed font-inter"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <label className="text-slate-200 font-inter text-sm font-medium">Full Name</label>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-manrope font-medium py-3"
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
            
            <Button
              type="button"
              onClick={debugUser}
              variant="outline"
              className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 font-manrope font-medium py-2 text-sm"
            >
              Debug User Data
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProfileForm

