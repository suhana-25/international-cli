// Real-time sync hook using Pusher
// Automatically refetches data when admin makes changes

import { useEffect, useCallback } from 'react'
import { pusherClient, CHANNELS } from '@/lib/pusher'

interface UseRealtimeSyncOptions {
  channel: keyof typeof CHANNELS
  onDataChange?: (action: 'created' | 'updated' | 'deleted', data: any) => void
  refetch: () => void | Promise<void>
  enabled?: boolean
}

export function useRealtimeSync({
  channel,
  onDataChange,
  refetch,
  enabled = true
}: UseRealtimeSyncOptions) {
  
  const handleDataChange = useCallback((action: 'created' | 'updated' | 'deleted', data: any) => {
    console.log(`📡 Real-time: ${action} event received on ${channel} channel`, data)
    
    // Call custom handler if provided
    if (onDataChange) {
      onDataChange(action, data)
    }
    
    // Always refetch data to ensure UI is up to date
    console.log(`🔄 Real-time: Refreshing ${channel} data due to ${action} event`)
    refetch()
  }, [channel, onDataChange, refetch])

  useEffect(() => {
    if (!enabled || !pusherClient) {
      if (!pusherClient) {
        console.log('⚠️ Pusher not configured, real-time sync disabled')
      }
      return
    }

    console.log(`🔌 Real-time: Subscribing to ${channel} channel`)
    
    // Subscribe to the channel
    const channelInstance = pusherClient.subscribe(CHANNELS[channel])
    
    // Listen for all events
    channelInstance.bind('created', (data: any) => handleDataChange('created', data))
    channelInstance.bind('updated', (data: any) => handleDataChange('updated', data))
    channelInstance.bind('deleted', (data: any) => handleDataChange('deleted', data))
    
    // Cleanup on unmount
    return () => {
      console.log(`🔌 Real-time: Unsubscribing from ${channel} channel`)
      if (pusherClient) {
        pusherClient.unsubscribe(CHANNELS[channel])
      }
    }
  }, [channel, handleDataChange, enabled])

  return {
    isConnected: pusherClient ? pusherClient.connection.state === 'connected' : false,
    connectionState: pusherClient ? pusherClient.connection.state : 'disconnected'
  }
}

// Specific hooks for different data types
export function useProductSync(refetch: () => void | Promise<void>, enabled = true) {
  return useRealtimeSync({
    channel: 'PRODUCTS',
    refetch,
    enabled
  })
}

export function useBlogSync(refetch: () => void | Promise<void>, enabled = true) {
  return useRealtimeSync({
    channel: 'BLOGS',
    refetch,
    enabled
  })
}

export function useGallerySync(refetch: () => void | Promise<void>, enabled = true) {
  return useRealtimeSync({
    channel: 'GALLERY',
    refetch,
    enabled
  })
}

export function useCategorySync(refetch: () => void | Promise<void>, enabled = true) {
  return useRealtimeSync({
    channel: 'CATEGORIES',
    refetch,
    enabled
  })
}
