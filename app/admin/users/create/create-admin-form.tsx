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
import { createAdminUser } from '@/lib/actions/user.actions'
import { createAdminSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateAdminForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof createAdminSchema>>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof createAdminSchema>) {
    try {
      const res = await createAdminUser(values)
      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
          className: "bg-red-800 border-red-700 text-red-200",
        })
      }

      toast({
        description: res.message,
        className: "bg-slate-800 border-slate-700 text-slate-200",
      })
      
      form.reset()
      router.push('/admin/users')
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to create admin user. Please try again.',
        className: "bg-red-800 border-red-700 text-red-200",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/admin/users"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 font-inter transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to User Management
      </Link>

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-poppins font-semibold text-white mb-6">Admin Details</h2>
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="text-slate-200 font-inter text-sm font-medium">Full Name *</label>
                  <FormControl>
                    <Input
                      placeholder="Enter admin's full name"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <label className="text-slate-200 font-inter text-sm font-medium">Email Address *</label>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter admin's email address"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <label className="text-slate-200 font-inter text-sm font-medium">Password *</label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter secure password"
                        {...field}
                        className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 font-inter pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                  <p className="text-xs text-slate-500 font-inter mt-1">
                    Password must be at least 8 characters long
                  </p>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-manrope font-medium py-3"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Admin...
                  </>
                ) : (
                  'Create Admin User'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/users')}
                className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600 font-manrope font-medium px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Info Note */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
        <h3 className="text-blue-200 font-poppins font-medium mb-2">Important Notes:</h3>
        <ul className="text-blue-300 font-inter text-sm space-y-1">
          <li>• Admin users have full access to manage products, orders, and other users</li>
          <li>• The new admin will be able to create additional admin accounts</li>
          <li>• Make sure to use a secure email and strong password</li>
          <li>• Admin credentials should be shared securely with the intended user</li>
        </ul>
      </div>
    </div>
  )
}






