'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Check, X, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { approveReview, rejectReview, deleteReview } from '@/lib/actions/review.actions'

interface Review {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
}

interface ReviewsManagementClientProps {
  initialReviews: Review[]
}

export default function ReviewsManagementClient({ initialReviews }: ReviewsManagementClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const { toast } = useToast()

  const handleApprove = async (reviewId: string) => {
    try {
      const result = await approveReview(reviewId)
      if (result.success) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId ? { ...review, isApproved: true } : review
        ))
        toast({
          description: result.message,
        })
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        description: "Failed to approve review",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (reviewId: string) => {
    try {
      const result = await rejectReview(reviewId)
      if (result.success) {
        setReviews(prev => prev.filter(review => review.id !== reviewId))
        toast({
          description: result.message,
        })
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        description: "Failed to reject review",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const result = await deleteReview(reviewId)
      if (result.success) {
        setReviews(prev => prev.filter(review => review.id !== reviewId))
        toast({
          description: result.message,
        })
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Reviews Management</h1>
        <p className="text-gray-600 mt-2">Manage and moderate customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reviews.filter(r => !r.isApproved).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.isApproved).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No reviews found</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{review.userName}</h4>
                        <Badge variant={review.isApproved ? "default" : "secondary"}>
                          {review.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-gray-700">{review.comment}</p>
                      
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Product ID: {review.productId}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!review.isApproved && (
                        <>
                          <Button
                            onClick={() => handleApprove(review.id)}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            onClick={() => handleReject(review.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        onClick={() => handleDelete(review.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
