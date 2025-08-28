import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, categories, gallery, blogPosts, users, orders } from '@/db/schema'
import { desc, gt } from 'drizzle-orm'

// Polling endpoint for sync events when WebSocket is not available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lastSync = searchParams.get('lastSync')
    const type = searchParams.get('type') // Optional: filter by type
    
    const since = lastSync ? parseInt(lastSync) : Date.now() - 60000 // Default: last minute
    
    console.log(`📡 Polling for sync events since: ${new Date(since).toISOString()}`)
    
    const events: any[] = []
    
    // Check for product changes
    if (!type || type === 'product') {
      const recentProducts = await db
        .select()
        .from(products)
        .where(gt(products.updatedAt, new Date(since)))
        .orderBy(desc(products.updatedAt))
        .limit(10)
      
      recentProducts.forEach(product => {
        events.push({
          type: 'product',
          action: 'update',
          id: product.id,
          data: product,
          timestamp: product.updatedAt.getTime()
        })
      })
    }
    
    // Check for category changes
    if (!type || type === 'category') {
      const recentCategories = await db
        .select()
        .from(categories)
        .where(gt(categories.updatedAt, new Date(since)))
        .orderBy(desc(categories.updatedAt))
        .limit(10)
      
      recentCategories.forEach(category => {
        events.push({
          type: 'category',
          action: 'update',
          id: category.id,
          data: category,
          timestamp: category.updatedAt.getTime()
        })
      })
    }
    
    // Check for gallery changes
    if (!type || type === 'gallery') {
      const recentGallery = await db
        .select()
        .from(gallery)
        .where(gt(gallery.updatedAt, new Date(since)))
        .orderBy(desc(gallery.updatedAt))
        .limit(10)
      
      recentGallery.forEach(item => {
        events.push({
          type: 'gallery',
          action: 'update',
          id: item.id,
          data: item,
          timestamp: item.updatedAt.getTime()
        })
      })
    }
    
    // Check for blog changes
    if (!type || type === 'blog') {
      const recentBlogs = await db
        .select()
        .from(blogPosts)
        .where(gt(blogPosts.updatedAt, new Date(since)))
        .orderBy(desc(blogPosts.updatedAt))
        .limit(10)
      
      recentBlogs.forEach(blog => {
        events.push({
          type: 'blog',
          action: 'update',
          id: blog.id,
          data: blog,
          timestamp: blog.updatedAt.getTime()
        })
      })
    }
    
    // Check for user changes
    if (!type || type === 'user') {
      const recentUsers = await db
        .select()
        .from(users)
        .where(gt(users.updatedAt, new Date(since)))
        .orderBy(desc(users.updatedAt))
        .limit(10)
      
      recentUsers.forEach(user => {
        events.push({
          type: 'user',
          action: 'update',
          id: user.id,
          data: user,
          timestamp: user.updatedAt.getTime()
        })
      })
    }
    
    // Check for order changes
    if (!type || type === 'order') {
      const recentOrders = await db
        .select()
        .from(orders)
        .where(gt(orders.updatedAt, new Date(since)))
        .orderBy(desc(orders.updatedAt))
        .limit(10)
      
      recentOrders.forEach(order => {
        events.push({
          type: 'order',
          action: 'update',
          id: order.id,
          data: order,
          timestamp: order.updatedAt.getTime()
        })
      })
    }
    
    // Sort events by timestamp
    events.sort((a, b) => b.timestamp - a.timestamp)
    
    console.log(`📡 Found ${events.length} sync events`)
    
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    console.error('❌ Sync polling failed:', error)
    return NextResponse.json({ 
      error: 'Failed to poll for sync events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
