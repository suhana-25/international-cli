'use server'

import db from '@/db/drizzle'
import { reviews } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createReview(data: {
  productId: string
  userName: string
  rating: number
  comment: string
}) {
  try {
    await db.insert(reviews).values({
      productId: data.productId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      isApproved: false // Reviews start as pending approval
    })

    revalidatePath(`/product/${data.productId}`)
    revalidatePath('/admin/reviews')
    
    return {
      success: true,
      message: 'Review submitted successfully'
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return {
      success: false,
      message: 'Failed to submit review'
    }
  }
}

export async function getProductReviews(productId: string) {
  try {
    const result = await db.select().from(reviews)
      .where(eq(reviews.productId, productId) && eq(reviews.isApproved, true))
      .orderBy(desc(reviews.createdAt))

    return result.map((review: any) => ({
      ...review,
      createdAt: review.createdAt?.toISOString() || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching reviews:', error)
    // Return empty array if there's an error
    return []
  }
}

export async function getAllReviews() {
  try {
    const result = await db.select().from(reviews)
      .orderBy(desc(reviews.createdAt))

    return result.map((review: any) => ({
      ...review,
      createdAt: review.createdAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching all reviews:', error)
    return []
  }
}

export async function approveReview(reviewId: string) {
  try {
    const result = await db.update(reviews)
      .set({ isApproved: true })
      .where(eq(reviews.id, reviewId))
      .returning()

    revalidatePath('/admin/reviews')
    
    return {
      success: true,
      message: 'Review approved successfully',
      review: result[0]
    }
  } catch (error) {
    console.error('Error approving review:', error)
    return {
      success: false,
      message: 'Failed to approve review'
    }
  }
}

export async function rejectReview(reviewId: string) {
  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId))
    
    revalidatePath('/admin/reviews')
    
    return {
      success: true,
      message: 'Review rejected successfully'
    }
  } catch (error) {
    console.error('Error rejecting review:', error)
    return {
      success: false,
      message: 'Failed to reject review'
    }
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId))
    
    revalidatePath('/admin/reviews')
    
    return {
      success: true,
      message: 'Review deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting review:', error)
    return {
      success: false,
      message: 'Failed to delete review'
    }
  }
}
