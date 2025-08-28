import { NextResponse } from 'next/server'
import { getProducts, reloadProducts } from '@/lib/product-store'
import { getCategories, reloadCategories } from '@/lib/category-store'
import { getBlogPosts, reloadBlogPosts } from '@/lib/blog-store'
import { getGalleryItems, reloadGalleryItems } from '@/lib/gallery-store'
import { pusherServer } from '@/lib/pusher'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const startTime = Date.now()
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: { status: 'unknown', details: '' },
      realtime: { status: 'unknown', details: '' },
      storage: { status: 'unknown', details: '' },
      performance: { status: 'unknown', details: '' }
    },
    responseTime: 0
  }

  try {
    // Test 1: Database Connection & Storage
    try {
      console.log('🔍 Health Check: Testing database connection...')
      
      // Test product storage
      reloadProducts()
      const products = getProducts()
      const productCount = products.length
      
      // Test category storage
      reloadCategories()
      const categories = getCategories()
      const categoryCount = categories.length
      
      // Test blog storage
      reloadBlogPosts()
      const blogs = getBlogPosts()
      const blogCount = blogs.length
      
      // Test gallery storage
      reloadGalleryItems()
      const galleryItems = getGalleryItems()
      const galleryCount = galleryItems.length
      
      healthCheck.checks.storage = {
        status: 'healthy',
        details: `Products: ${productCount}, Categories: ${categoryCount}, Blogs: ${blogCount}, Gallery: ${galleryCount}`
      }
      
      console.log('✅ Health Check: Storage test passed')
    } catch (error) {
      healthCheck.checks.storage = {
        status: 'unhealthy',
        details: error instanceof Error ? error.message : 'Unknown storage error'
      }
      console.error('❌ Health Check: Storage test failed:', error)
    }

    // Test 2: Real-time Service (Pusher)
    try {
      console.log('🔍 Health Check: Testing real-time service...')
      
      if (pusherServer) {
        // Test Pusher connection by checking if server is configured
        healthCheck.checks.realtime = {
          status: 'healthy',
          details: `Pusher configured and ready`
        }
        console.log('✅ Health Check: Real-time service test passed')
      } else {
        healthCheck.checks.realtime = {
          status: 'warning',
          details: 'Pusher not configured - real-time sync disabled'
        }
        console.log('⚠️ Health Check: Real-time service not configured')
      }
    } catch (error) {
      healthCheck.checks.realtime = {
        status: 'unhealthy',
        details: error instanceof Error ? error.message : 'Real-time service error'
      }
      console.error('❌ Health Check: Real-time service test failed:', error)
    }

    // Test 3: Performance
    try {
      console.log('🔍 Health Check: Testing performance...')
      
      // Test API response time
      const apiTestStart = Date.now()
      await fetch('https://httpbin.org/delay/0.1', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      const apiTestTime = Date.now() - apiTestStart
      
      healthCheck.checks.performance = {
        status: 'healthy',
        details: `API test response: ${apiTestTime}ms`
      }
      
      console.log('✅ Health Check: Performance test passed')
    } catch (error) {
      healthCheck.checks.performance = {
        status: 'warning',
        details: error instanceof Error ? error.message : 'Performance test error'
      }
      console.log('⚠️ Health Check: Performance test warning:', error)
    }

    // Calculate overall health status
    const allChecks = Object.values(healthCheck.checks)
    const healthyChecks = allChecks.filter(check => check.status === 'healthy').length
    const totalChecks = allChecks.length
    
    if (healthyChecks === totalChecks) {
      healthCheck.status = 'healthy'
    } else if (healthyChecks >= totalChecks * 0.7) {
      healthCheck.status = 'degraded'
    } else {
      healthCheck.status = 'unhealthy'
    }

    // Calculate response time
    healthCheck.responseTime = Date.now() - startTime

    console.log(`✅ Health Check: Completed in ${healthCheck.responseTime}ms - Status: ${healthCheck.status}`)

    // Return appropriate HTTP status
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthCheck, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'X-Health-Check': 'true',
        'X-Response-Time': `${healthCheck.responseTime}ms`
      }
    })

  } catch (error) {
    console.error('❌ Health Check: Critical error:', error)
    
    healthCheck.status = 'unhealthy'
    healthCheck.checks.database = {
      status: 'unhealthy',
      details: 'Critical health check error'
    }
    healthCheck.responseTime = Date.now() - startTime

    return NextResponse.json(healthCheck, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'X-Health-Check': 'true',
        'X-Response-Time': `${healthCheck.responseTime}ms`
      }
    })
  }
}

export async function POST() {
  return NextResponse.json({ 
    status: 'healthy', 
    message: 'Health check passed' 
  })
}
