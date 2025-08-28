import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import { getReviews, updateReview, deleteReview } from '@/lib/review-store'

export async function GET(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // if (!session?.user || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const reviews = getReviews()
    
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

export async function PUT(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    
    // if (!session?.user || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()
    const { id, action } = body
    
    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: 'Review ID and action are required' },
        { status: 400 }
      )
    }

    if (action === 'delete') {
      const deleted = deleteReview(id)
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Review not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'Review deleted successfully'
      })
    }

    if (action === 'approve' || action === 'reject') {
      const status = action === 'approve' ? 'approved' : 'rejected'
      const updatedReview = updateReview(id, {
        status,
        reviewedBy: 'admin'
      })
      
      if (!updatedReview) {
        return NextResponse.json(
          { success: false, error: 'Review not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: updatedReview,
        message: `Review ${action}d successfully`
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

