// Manual cache invalidation for real-time updates
import { revalidateTag, revalidatePath } from 'next/cache'

export const cacheKeys = {
  categories: 'categories',
  products: 'products',
  users: 'users',
  orders: 'orders',
  chat: 'chat'
} as const

export async function invalidateCache(key: keyof typeof cacheKeys) {
  try {
    // Invalidate specific cache tags
    revalidateTag(cacheKeys[key])
    
    // Invalidate related paths
    switch (key) {
      case 'categories':
        revalidatePath('/api/categories')
        revalidatePath('/catalog')
        break
      case 'products':
        revalidatePath('/api/products')
        revalidatePath('/catalog')
        revalidatePath('/admin/products')
        break
      case 'users':
        revalidatePath('/api/user/data')
        revalidatePath('/admin/users')
        break
      case 'orders':
        revalidatePath('/api/user/orders')
        revalidatePath('/admin/orders')
        break
      default:
        break
    }
    
    console.log(`✅ Cache invalidated for: ${key}`)
  } catch (error) {
    console.error(`❌ Cache invalidation failed for ${key}:`, error)
  }
}

// Force real-time update function
export async function forceRealTimeUpdate(type: string, data?: any) {
  try {
    // Send update via WebSocket if available
    if (typeof window !== 'undefined' && (window as any).socket) {
      (window as any).socket.emit('data-update', { type, data, timestamp: Date.now() })
    }
    
    // Also invalidate cache
    if (type in cacheKeys) {
      await invalidateCache(type as keyof typeof cacheKeys)
    }
    
    console.log(`🚀 Real-time update sent: ${type}`)
  } catch (error) {
    console.error(`❌ Real-time update failed for ${type}:`, error)
  }
}

// Client-side real-time update listener
export function setupRealTimeUpdates() {
  if (typeof window === 'undefined') return
  
  // Listen for data updates
  if ((window as any).socket) {
    (window as any).socket.on('data-update', (update: { type: string; data: any; timestamp: number }) => {
      console.log('📡 Real-time update received:', update.type)
      
      // Trigger custom events for components to listen
      window.dispatchEvent(new CustomEvent('realtime-update', { 
        detail: update 
      }))
    })
  }
}
