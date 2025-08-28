'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  Star, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Mail,
  User,
  Package,
  Eye,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  productId: string
  title: string
  description: string
  country: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  userName: string
  userEmail: string
  createdAt: string
  updatedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

interface Product {
  id: string
  name: string
  slug: string
}

export default function ReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [reviewsRes, productsRes] = await Promise.all([
        fetch('/api/admin/reviews'),
        fetch('/api/products')
      ])

      if (reviewsRes.ok) {
        const reviewsResult = await reviewsRes.json()
        if (reviewsResult.success) {
          setReviews(reviewsResult.data || [])
        }
      }

      if (productsRes.ok) {
        const productsResult = await productsRes.json()
        if (productsResult.success) {
          setProducts(productsResult.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        variant: "destructive",
        description: "Failed to load reviews",
        className: "bg-red-800 border-red-700 text-red-200",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          action
        }),
      })

      const result = await response.json()

      if (result.success) {
        if (action === 'delete') {
          setReviews(prev => prev.filter(review => review.id !== reviewId))
          toast({
            description: "Review deleted successfully",
            className: "bg-slate-800 border-slate-700 text-slate-200",
          })
        } else {
          setReviews(prev => prev.map(review => 
            review.id === reviewId 
              ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' }
              : review
          ))
          toast({
            description: `Review ${action}d successfully`,
            className: "bg-slate-800 border-slate-700 text-slate-200",
          })
        }
      } else {
        throw new Error(result.error || `Failed to ${action} review`)
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error)
      toast({
        variant: "destructive",
        description: `Failed to ${action} review`,
        className: "bg-red-800 border-red-700 text-red-200",
      })
    }
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : 'Unknown Product'
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-slate-600'
            )}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-300 border-yellow-700">Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-700">Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-900/30 text-red-300 border-red-700">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    return review.status === filter
  })

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-slate-800 rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-poppins font-bold text-white">Review Management</h1>
          <Button
            onClick={fetchData}
            variant="outline"
            className="border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Star className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Reviews</p>
                  <p className="text-white text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-white text-xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-900/30 rounded-lg">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Approved</p>
                  <p className="text-white text-xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-900/30 rounded-lg">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Rejected</p>
                  <p className="text-white text-xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className={cn(
                filter === status 
                  ? "bg-slate-100 text-slate-900" 
                  : "border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({status === 'pending' ? stats.pending : status === 'approved' ? stats.approved : stats.rejected})
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-poppins font-medium text-slate-300 mb-2">
                  No {filter !== 'all' ? filter : ''} Reviews
                </h3>
                <p className="text-slate-500">
                  {filter === 'pending' 
                    ? 'No reviews waiting for approval.' 
                    : filter === 'approved'
                    ? 'No approved reviews yet.'
                    : filter === 'rejected'
                    ? 'No rejected reviews.'
                    : 'No reviews have been submitted yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}
                        <span className="text-slate-400 text-sm">
                          {review.rating} star{review.rating !== 1 ? 's' : ''}
                        </span>
                        {getStatusBadge(review.status)}
                      </div>
                      <CardTitle className="text-slate-100 font-poppins text-lg">
                        {review.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleReviewAction(review.id, 'approve')}
                            className="bg-green-800 hover:bg-green-700 text-green-100"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReviewAction(review.id, 'reject')}
                            className="border-red-700 hover:border-red-600 hover:bg-red-900/30 text-red-300"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewAction(review.id, 'delete')}
                        className="border-red-700 hover:border-red-600 hover:bg-red-900/30 text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Review Content */}
                    <p className="text-slate-300 font-inter leading-relaxed">
                      {review.description}
                    </p>

                    {/* Product & User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300 font-medium">
                            {getProductName(review.productId)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">{review.userName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">{review.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">{review.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Submitted: {formatDate(review.createdAt)}</span>
                      </div>
                      {review.reviewedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Reviewed: {formatDate(review.reviewedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
