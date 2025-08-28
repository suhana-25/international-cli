'use client'

import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react' // Removed - using custom auth
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Send, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    rating: 0
  })
  
  // const { data: session, status } = useSession() // Removed - using custom auth
  const session = { user: { id: 'reviewer', name: 'Customer', email: 'customer@example.com' } } // Mock session for reviews
  const status = 'authenticated' // Always authenticated for reviews
  const { toast } = useToast()

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a title",
      })
      return
    }
    
    if (!formData.description.trim()) {
      toast({
        variant: "destructive",
        description: "Please tell us what you liked",
      })
      return
    }
    
    if (!formData.country.trim()) {
      toast({
        variant: "destructive",
        description: "Please tell us where you're from",
      })
      return
    }
    
    if (formData.rating === 0) {
      toast({
        variant: "destructive",
        description: "Please select a star rating",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId,
          userName: session?.user?.name || 'Anonymous',
          userEmail: session?.user?.email || ''
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          description: "Review submitted successfully! It will appear after admin approval.",
        })
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          country: '',
          rating: 0
        })
        
        setShowForm(false)
        onReviewSubmitted?.()
      } else {
        throw new Error(result.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        variant: "destructive",
        description: "Failed to submit review. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show login prompt if not authenticated
  // Skip loading check for custom auth
  if (false) { // status === 'loading'
    return (
      <div className="text-center">
        <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  // Skip auth check for custom auth
  if (false) { // status === 'unauthenticated'
    return (
      <Card className="bg-white border-border shadow-lg">
        <CardContent className="p-6 text-center">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-foreground mb-2">
            Sign in to Write a Review
          </h3>
          <p className="text-muted-foreground font-inter mb-4">
            Please sign in to share your experience with this product.
          </p>
          <Link href="/auth/signin">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-manrope font-semibold">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (!showForm) {
    return (
      <div className="text-center">
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="border-border hover:border-primary hover:bg-secondary text-foreground hover:text-accent"
        >
          <Star className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
        <p className="text-muted-foreground text-sm mt-2">
          Signed in as {session?.user?.name}
        </p>
      </div>
    )
  }

  return (
    <Card className="bg-white border-border shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground font-poppins text-lg">Write a Review</CardTitle>
          <div className="text-right">
            <p className="text-foreground text-sm font-medium">{session?.user?.name}</p>
            <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-manrope font-medium text-foreground">
              Rating *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={cn(
                    "transition-colors duration-200",
                    star <= formData.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground hover:text-yellow-500"
                  )}
                >
                  <Star className="h-6 w-6" />
                </button>
              ))}
              <span className="ml-2 text-muted-foreground text-sm">
                {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <label className="block text-sm font-manrope font-medium text-foreground">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Give your review a title"
              className="bg-white border-border text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* What you liked */}
          <div className="space-y-2">
            <label className="block text-sm font-manrope font-medium text-foreground">
              What you liked about us? *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell us what you liked about this product..."
              rows={4}
              className="bg-white border-border text-foreground placeholder-muted-foreground resize-none"
            />
          </div>

          {/* Where are you from */}
          <div className="space-y-2">
            <label className="block text-sm font-manrope font-medium text-foreground">
              Where are you from? *
            </label>
            <Input
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="e.g., India, USA, Canada, etc."
              className="bg-white border-border text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-manrope font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="border-border hover:border-primary hover:bg-secondary text-foreground hover:text-accent"
            >
              Cancel
            </Button>
          </div>
          
          <p className="text-muted-foreground text-xs mt-3">
            Your review will be visible after admin approval. Submitting as {session?.user?.name}.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
