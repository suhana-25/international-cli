'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { CreditCard, ArrowRight, ArrowLeft, Globe } from 'lucide-react'

interface PaymentMethodFormProps {
  user?: any
}

export default function PaymentMethodForm({ user }: PaymentMethodFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Secure worldwide payment with your PayPal account',
      icon: Globe,
      popular: true,
      international: true
    },
    {
      id: 'stripe',
      name: 'Stripe Payment',
      description: 'Credit/Debit card payment with Visa, Mastercard, American Express',
      icon: CreditCard,
      popular: true,
      international: true
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedMethod) {
          toast({
            variant: 'destructive',
        description: 'Please select a payment method'
          })
          return
        }
        
    setIsSubmitting(true)

    try {
      // Save payment method to API
      const response = await fetch('/api/user/payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: selectedMethod }),
      })

      if (!response.ok) {
        throw new Error('Failed to save payment method')
      }

      const result = await response.json()

      // Store in localStorage for immediate access (especially for guest users)
      localStorage.setItem('selected-payment-method', selectedMethod)
        
        toast({
          description: result.message || 'Payment method saved successfully!',
        className: "bg-white border-border text-foreground shadow-lg",
        })
        
      // Redirect to place order page
        router.push('/place-order')
    } catch (error) {
      console.error('Payment method error:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to save payment method. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-poppins font-semibold text-foreground">Secure Payment Options</h2>
        </div>
        <p className="text-sm text-muted-foreground font-inter">
          Choose between PayPal or Stripe for secure worldwide payment processing.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="relative">
                <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                <Label htmlFor={method.id} className="cursor-pointer">
                  <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:border-accent/50 ${
                    selectedMethod === method.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border bg-background hover:bg-secondary'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        selectedMethod === method.id 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-poppins font-semibold text-foreground tracking-tight">
                            {method.name}
                          </h3>
                          <div className="flex gap-1">
                            {method.popular && (
                              <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full font-manrope font-medium border border-success/20">
                                Popular
                              </span>
                            )}
                            {method.international && (
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-manrope font-medium border border-primary/20">
                                Global
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-inter mt-1">
                          {method.description}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id
                          ? 'border-accent bg-accent'
                          : 'border-border'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/shipping-address')}
            className="w-full sm:w-auto border-border text-foreground hover:bg-secondary font-manrope font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shipping
          </Button>
          
          <Button
            type="submit"
            disabled={!selectedMethod || isSubmitting}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-manrope font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2" />
                Processing...
              </>
            ) : (
              <>
                Continue to Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
              </Button>
            </div>
          </form>
      </div>
  )
}
