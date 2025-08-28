'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

const links = [
  {
    title: 'Overview',
    href: '/admin/overview',
  },
  {
    title: 'Products',
    href: '/admin/products',
  },

  {
    title: 'Gallery',
    href: '/admin/gallery',
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
  },
  {
    title: 'Blog',
    href: '/admin/blog',
  },
  {
    title: 'Comments',
    href: '/admin/blog/comments',
  },
  {
    title: 'Chat',
    href: '/admin/chat',
  },
  {
    title: 'Orders',
    href: '/admin/orders',
  },
  {
    title: 'Users',
    href: '/admin/users',
  },
  {
    title: 'Admins',
    href: '/admin/admins',
  },
  {
    title: 'Contact',
    href: '/admin/contact',
  },
  {
    title: 'About',
    href: '/admin/about',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
  },
]
export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname?.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
