'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  title: string
  description: string
  country: string
  rating: number
  userName: string
  createdAt: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
}

interface ReviewsDisplayProps {
  productId: string
  refreshKey?: number
}

export default function ReviewsDisplay({ productId, refreshKey }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [productId, refreshKey])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      
      // Fetch reviews and stats
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`/api/reviews?productId=${productId}`),
        fetch(`/api/reviews/stats?productId=${productId}`)
      ])

      if (reviewsRes.ok) {
        const reviewsResult = await reviewsRes.json()
        if (reviewsResult.success) {
          setReviews(reviewsResult.data || [])
        }
      }

      if (statsRes.ok) {
        const statsResult = await statsRes.json()
        if (statsResult.success) {
          setStats(statsResult.data)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
              star <= rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-muted-foreground'
            )}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-2xl animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {stats && stats.totalReviews > 0 && (
        <Card className="bg-white border-border shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="text-4xl font-poppins font-bold text-blue-600">
                    {stats.averageRating}
                  </span>
                  <div>
                    {renderStars(Math.round(stats.averageRating), 'md')}
                    <p className="text-gray-600 text-sm mt-1 font-medium">
                      Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating] || 0
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
                  
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="text-foreground w-2">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-poppins font-semibold text-gray-900">
          Customer Reviews {stats && `(${stats.totalReviews})`}
        </h3>
        
        {reviews.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-poppins font-semibold text-gray-900 mb-2">
                No Reviews Yet
              </h4>
              <p className="text-gray-600 font-inter">
                Be the first to review this product and help other customers!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-white border-border shadow-md">
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-gray-600 text-sm font-medium">
                          {review.rating} star{review.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <h4 className="font-poppins font-semibold text-gray-900 text-lg">
                        {review.title}
                      </h4>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-800 font-inter leading-relaxed mb-4">
                    {review.description}
                  </p>

                  {/* Review Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="font-manrope font-semibold text-gray-900">
                        {review.userName}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{review.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
