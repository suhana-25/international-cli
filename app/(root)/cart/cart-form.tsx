'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useCart } from '@/lib/context/cart-context'
import { ArrowRight, Minus, Plus, Trash, ShoppingBag, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function CartForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const { state, updateQuantity, removeFromCart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2 tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground font-inter">Review your items before checkout</p>
      </div>

      {state.items.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-poppins font-semibold text-foreground mb-2 tracking-tight">Your cart is empty</h3>
            <p className="text-muted-foreground font-inter mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/catalog">
              <Button className="font-manrope font-medium">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id} className="overflow-hidden bg-white border-border">
                <CardContent className="p-0">
                  <div className="flex items-center p-4 space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && item.image !== '/placeholder-product.jpg' ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-poppins font-semibold text-foreground truncate tracking-tight">
                        {item.name}
                      </h3>
                      <p className="font-poppins font-bold text-lg text-foreground mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.weight > 0 && (
                        <p className="font-inter text-sm text-muted-foreground">
                          Weight: {item.weight}kg
                        </p>
                      )}
                      {item.stock !== undefined && (
                        <p className="font-inter text-xs text-muted-foreground">
                          {item.stock} in stock
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isPending}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="font-manrope font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const result = updateQuantity(item.id, item.quantity + 1)
                          if (result.message) {
                            toast({
                                                          description: result.message,
                            })
                          }
                        }}
                        disabled={isPending || (item.stock !== undefined && item.quantity >= item.stock)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-poppins font-bold text-lg text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeFromCart(item.id)
                          toast({
                            description: `${item.name} removed from cart`,
                          })
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto mt-1"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-white border-border">
              <CardHeader>
                <CardTitle className="font-poppins font-bold tracking-tight text-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-inter text-foreground">
                    <span>Items ({state.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-inter text-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-poppins font-bold text-lg text-foreground">
                      <span>Total</span>
                      <span>${state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    startTransition(() => {
                      // Direct redirect to shipping address
                      // Route guard will handle authentication check
                      router.push('/shipping-address')
                    })
                  }
                  className="w-full font-manrope font-medium"
                  disabled={isPending || state.items.length === 0}
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>

                <Link href="/catalog" className="block">
                  <Button variant="outline" className="w-full font-inter">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
