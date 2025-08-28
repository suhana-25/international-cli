'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Store, 
  Package, 
  Info, 
  Phone, 
  Image, 
  ShoppingCart,
  LogOut,
  LogIn
} from 'lucide-react'
import { SignOut } from '@/lib/actions/user.actions'

interface HamburgerMenuProps {
  isSignedIn: boolean
}

const menuItems = [
  { name: 'Store', href: '/catalog', icon: 'Store' },
  { name: 'Products', href: '/catalog', icon: 'Package' },
  { name: 'About', href: '/about', icon: 'Info' },
  { name: 'Contact', href: '/contact', icon: 'Phone' },
  { name: 'Gallery', href: '/gallery', icon: 'Image' }
]

export default function HamburgerMenu({ isSignedIn }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 hover:bg-accent"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMenu}
              className="p-2 hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Cart</span>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = {
                  Store,
                  Package,
                  Info,
                  Phone,
                  Image
                }[item.icon] || Store

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-manrope font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Sign In/Out Section */}
            <div className="mt-3 pt-3 border-t border-border">
              {isSignedIn ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={async () => {
                    try {
                      // Clear all local storage
                      localStorage.clear()
                      
                      // Clear all session storage
                      sessionStorage.clear()
                      
                      // Clear all cookies (except essential ones)
                      document.cookie.split(";").forEach(function(c) { 
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                      })
                      
                      // Sign out from NextAuth
                      await SignOut()
                      
                      // Close menu and redirect
                      closeMenu()
                      router.push('/')
                      router.refresh()
                    } catch (error) {
                      console.error('SignOut error:', error)
                      // Fallback to direct signout
                      window.location.href = '/api/auth/signout'
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    closeMenu()
                    router.push('/auth/sign-in')
                  }}
                >
                  <LogIn className="w-4 h-4 mr-3" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-50"
          onClick={closeMenu}
        />
      )}
    </div>
  )
}
