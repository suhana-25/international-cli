'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { SignOut } from '@/lib/actions/user.actions' // Removed NextAuth
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getSession, clearSession } from '@/lib/session'

export default function UserButtonClient() {
  const [session, setSession] = useState<any>(null)
  const [status, setStatus] = useState('loading')
  const router = useRouter()

  useEffect(() => {
    const loadSession = () => {
      const userSession = getSession()
      console.log('🔍 UserButton: Session from localStorage:', userSession)
      
      if (userSession) {
        // Wrap user data in session object structure
        const sessionData = { user: userSession }
        setSession(sessionData)
        setStatus('authenticated')
        console.log('✅ UserButton: Session set:', sessionData)
      } else {
        setSession(null)
        setStatus('unauthenticated')
        console.log('❌ UserButton: No session found')
      }
    }

    // Load session initially
    loadSession()

    // Listen for storage changes (when user logs in from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        console.log('📱 UserButton: Storage changed, reloading session...')
        loadSession()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for session changes
    const interval = setInterval(loadSession, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (status === 'loading') {
    return (
      <Button size="sm" disabled className="h-9 px-3 sm:h-10 sm:px-4 text-xs sm:text-sm font-manrope font-medium">
        Loading...
      </Button>
    )
  }

  if (!session) {
    return (
      <Link href="/auth/sign-in">
        <Button size="sm" className="h-9 px-3 sm:h-10 sm:px-4 text-xs sm:text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white">
          Sign In
        </Button>
      </Link>
    )
  }

  const handleSignOut = async () => {
    try {
      // Clear session from our custom auth system
      clearSession()
      setSession(null)
      setStatus('unauthenticated')
      
      // Redirect to homepage
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('SignOut error:', error)
      // Fallback to clear and redirect
      clearSession()
      window.location.href = '/'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 max-w-[100px] sm:max-w-[150px] text-gray-700 hover:text-blue-600 hover:bg-blue-50"
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5 sm:hidden" />
          <span className="truncate text-xs sm:text-sm hidden sm:inline font-manrope font-medium">
            {session?.user?.name || 'User'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-gray-200 shadow-xl z-[10000]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-poppins font-medium leading-none text-gray-900">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs leading-none text-gray-600 font-inter">
              {session?.user?.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
          <Link className="w-full font-inter text-gray-700 hover:text-blue-600" href="/user/profile">
            Profile Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
          <Link className="w-full font-inter text-gray-700 hover:text-blue-600" href="/user/orders">
            Order History
          </Link>
        </DropdownMenuItem>

        {session?.user?.role === 'admin' && (
          <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
            <Link className="w-full font-inter text-gray-700 hover:text-blue-600" href="/admin/overview">
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="p-0 mb-1 hover:bg-red-50 focus:bg-red-50">
          <Button
            onClick={handleSignOut}
            className="w-full py-4 px-2 h-4 justify-start bg-transparent hover:bg-red-50 text-gray-700 hover:text-red-600 font-inter"
            variant="ghost"
          >
            Sign Out
          </Button>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
