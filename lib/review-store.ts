import fs from 'fs'
import path from 'path'

export interface Review {
  id: string
  productId: string
  title: string
  description: string
  country: string
  rating: number // 1-5 stars
  status: 'pending' | 'approved' | 'rejected'
  userName: string
  userEmail: string
  createdAt: Date
  updatedAt: Date
  reviewedAt?: Date // When admin approved/rejected
  reviewedBy?: string // Admin who reviewed
}

const STORAGE_PATH = path.join(process.cwd(), 'data', 'reviews.json')

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(STORAGE_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load reviews from file
function loadReviews(): Review[] {
  ensureDataDir()
  
  if (!fs.existsSync(STORAGE_PATH)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(STORAGE_PATH, 'utf-8')
    const reviews = JSON.parse(data)
    
    // Convert date strings back to Date objects
    return reviews.map((review: any) => ({
      ...review,
      createdAt: new Date(review.createdAt),
      updatedAt: new Date(review.updatedAt),
      reviewedAt: review.reviewedAt ? new Date(review.reviewedAt) : undefined
    }))
  } catch (error) {
    console.error('Error loading reviews:', error)
    return []
  }
}

// Save reviews to file
function saveReviews(reviews: Review[]) {
  ensureDataDir()
  
  try {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(reviews, null, 2))
  } catch (error) {
    console.error('Error saving reviews:', error)
  }
}

// In-memory reviews cache
let reviews: Review[] = loadReviews()

// Get all reviews
export const getReviews = (): Review[] => {
  return [...reviews]
}

// Get reviews by product ID
export const getReviewsByProduct = (productId: string, includeAll: boolean = false): Review[] => {
  if (includeAll) {
    return reviews.filter(review => review.productId === productId)
  }
  return reviews.filter(review => 
    review.productId === productId && review.status === 'approved'
  )
}

// Get review by ID
export const getReviewById = (id: string): Review | null => {
  return reviews.find(review => review.id === id) || null
}

// Create new review
export const createReview = (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Review => {
  const newReview: Review = {
    ...data,
    id: Date.now().toString(),
    status: 'pending', // All new reviews start as pending
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  reviews.push(newReview)
  saveReviews(reviews)
  return newReview
}

// Update review (mainly for admin approval/rejection)
export const updateReview = (id: string, data: Partial<Review>): Review | null => {
  const index = reviews.findIndex(review => review.id === id)
  
  if (index === -1) {
    return null
  }
  
  reviews[index] = {
    ...reviews[index],
    ...data,
    updatedAt: new Date(),
    reviewedAt: data.status && data.status !== 'pending' ? new Date() : reviews[index].reviewedAt
  }
  
  saveReviews(reviews)
  return reviews[index]
}

// Delete review
export const deleteReview = (id: string): boolean => {
  const index = reviews.findIndex(review => review.id === id)
  
  if (index === -1) {
    return false
  }
  
  reviews.splice(index, 1)
  saveReviews(reviews)
  return true
}

// Get pending reviews (for admin)
export const getPendingReviews = (): Review[] => {
  return reviews.filter(review => review.status === 'pending')
}

// Get review statistics for a product
export const getProductReviewStats = (productId: string) => {
  const productReviews = getReviewsByProduct(productId)
  
  if (productReviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
  
  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / productReviews.length
  
  const ratingDistribution = productReviews.reduce((dist, review) => {
    dist[review.rating as 1 | 2 | 3 | 4 | 5]++
    return dist
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  
  return {
    totalReviews: productReviews.length,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    ratingDistribution
  }
}
