'use client'

import { ShippingAddress } from '@/types'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { shippingAddressSchema } from '@/lib/validator'
import { shippingAddressDefaultValues } from '@/lib/constants'
import { useToast } from '@/components/ui/use-toast'
import { useTransition } from 'react'
import { updateUserAddress } from '@/lib/actions/user.actions'
import { useCheckout } from '@/lib/context/checkout-context'
import { useState, useEffect } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the Map component
const ShippingAddressMap = dynamic(() => import('@/components/shared/map'), {
  loading: () => <div className="w-full h-[400px] bg-muted border border-border rounded-lg flex items-center justify-center">
    <div className="text-muted-foreground">Loading map...</div>
  </div>,
  ssr: false
})

export default function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress | null
}) {
  const router = useRouter()
  const { setShippingAddress } = useCheckout()
  const [buyNowProduct, setBuyNowProduct] = useState<any>(null)

  // Check for buy now product on component mount
  useEffect(() => {
    const storedProduct = localStorage.getItem('buyNowProduct')
    if (storedProduct) {
      try {
        setBuyNowProduct(JSON.parse(storedProduct))
      } catch (error) {
        console.error('Error parsing buy now product:', error)
      }
    }
  }, [])

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { ...shippingAddressDefaultValues, ...address },
  })
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(() => {
      const asyncFn = async () => {
        const res = await updateUserAddress(values)
        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          })
          return
        }
        
        // Update checkout state
        setShippingAddress(true)
        
        // If guest user, save address to localStorage
        if (res.isGuest) {
          localStorage.setItem('guestShippingAddress', JSON.stringify(values))
        }
        
        toast({
          description: res.message || 'Shipping address saved successfully!',
        })
        
        // If this is a buy now purchase, redirect to place order
        if (buyNowProduct) {
          router.push('/place-order')
        } else {
          router.push('/place-order')
        }
      }
      asyncFn()
    })
  }


  return (
    <div className="bg-white border border-border rounded-lg p-6">
      {/* Buy Now Product Display */}
      {buyNowProduct && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
              <img 
                src={buyNowProduct.image} 
                alt={buyNowProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-poppins font-semibold text-foreground mb-1">
                {buyNowProduct.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Qty: {buyNowProduct.quantity}</span>
                <span>Price: ${buyNowProduct.price.toFixed(2)}</span>
                <span className="font-semibold text-foreground">
                  Total: ${(buyNowProduct.price * buyNowProduct.quantity).toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem('buyNowProduct')
                setBuyNowProduct(null)
                router.push('/catalog')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-poppins font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      {...field} 
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-poppins font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Enter your email address" 
                      {...field} 
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-poppins font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your phone number" 
                      {...field} 
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-poppins font-medium">Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your street address" 
                      {...field} 
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-poppins font-medium">City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City" 
                        {...field} 
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-poppins font-medium">Country</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Country" 
                        {...field} 
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-poppins font-medium">Postal Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ZIP/Postal" 
                        {...field} 
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground font-inter"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-poppins font-semibold text-foreground">Select Location on Map</h3>
            <ShippingAddressMap setShippingLocation={(location: { lat: number; lng: number }) => {
              console.log('Selected location:', location)
            }} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full sm:w-auto font-manrope font-medium"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin w-4 h-4 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={() => {
                if (buyNowProduct) {
                  // If buy now, go back to product page
                  localStorage.removeItem('buyNowProduct')
                  router.push(`/product/${buyNowProduct.slug || 'product'}`)
                } else {
                  // If normal checkout, go back to cart
                  router.push('/cart')
                }
              }}
              className="w-full sm:w-auto font-manrope font-medium"
            >
              {buyNowProduct ? 'Back to Product' : 'Back to Cart'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
