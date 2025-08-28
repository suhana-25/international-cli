import { NextRequest, NextResponse } from 'next/server'
import { createReview, getReviewsByProduct } from '@/lib/review-store'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get only approved reviews for public API
    const reviews = getReviewsByProduct(productId, false)
    
    return NextResponse.json({
      success: true,
      data: reviews
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    const { productId, title, description, country, rating, userName, userEmail } = body
    
    if (!productId || !title || !description || !country || !userName || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Create review
    const newReview = createReview({
      productId: productId.toString(),
      title: title.trim(),
      description: description.trim(),
      country: country.trim(),
      rating: parseInt(rating),
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase()
    })
    
    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully! It will appear after admin approval.'
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}

