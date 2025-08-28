// Pusher configuration for real-time sync
// Free tier: 200k messages/month, 100 concurrent connections

import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// Check if Pusher credentials are available
const hasPusherCredentials = process.env.PUSHER_APP_ID && 
                            process.env.NEXT_PUBLIC_PUSHER_KEY && 
                            process.env.PUSHER_SECRET && 
                            process.env.NEXT_PUBLIC_PUSHER_CLUSTER

// Server-side Pusher (for sending notifications)
export const pusherServer = hasPusherCredentials ? new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
}) : null

// Client-side Pusher (for receiving notifications)
export const pusherClient = hasPusherCredentials ? new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
) : null

// Channel names for different data types
export const CHANNELS = {
  PRODUCTS: 'products',
  BLOGS: 'blogs', 
  GALLERY: 'gallery',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
} as const

// Event types for different actions
export const EVENTS = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
} as const

// Helper function to send notifications
export async function sendNotification(
  channel: string,
  event: string,
  data: any
) {
  if (!pusherServer) {
    console.log('⚠️ Pusher not configured, skipping notification')
    return
  }
  
  try {
    await pusherServer.trigger(channel, event, data)
    console.log(`📡 Pusher: Sent ${event} event to ${channel} channel`)
  } catch (error) {
    console.error(`❌ Pusher: Failed to send ${event} event to ${channel} channel:`, error)
  }
}

// Helper function to send product notifications
export async function notifyProductChange(action: 'created' | 'updated' | 'deleted', product: any) {
  await sendNotification(CHANNELS.PRODUCTS, action, {
    action,
    product,
    timestamp: new Date().toISOString(),
  })
}

// Helper function to send blog notifications
export async function notifyBlogChange(action: 'created' | 'updated' | 'deleted', blog: any) {
  await sendNotification(CHANNELS.BLOGS, action, {
    action,
    blog,
    timestamp: new Date().toISOString(),
  })
}

// Helper function to send gallery notifications
export async function notifyGalleryChange(action: 'created' | 'updated' | 'deleted', item: any) {
  await sendNotification(CHANNELS.GALLERY, action, {
    action,
    item,
    timestamp: new Date().toISOString(),
  })
}

// Helper function to send category notifications
export async function notifyCategoryChange(action: 'created' | 'updated' | 'deleted', category: any) {
  await sendNotification(CHANNELS.CATEGORIES, action, {
    action,
    category,
    timestamp: new Date().toISOString(),
  })
}
