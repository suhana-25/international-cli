'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/context/cart-context'

export default function CartButton() {
  const { cartItemCount } = useCart()
  
  return (
    <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 relative">
      <Link href="/cart" className="flex items-center gap-1 sm:gap-2">
        <div className="relative">
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          {cartItemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-manrope font-medium">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Badge>
          )}
        </div>
        <span className="hidden sm:inline text-sm font-manrope font-medium">Cart</span>
      </Link>
    </Button>
  )
}
