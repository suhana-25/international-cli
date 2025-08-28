'use client'

import { io, Socket } from 'socket.io-client'

class WebSocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(userId?: string, isAdmin = false) {
    if (this.socket?.connected) {
      console.log('🔌 Already connected')
      return this.socket
    }

    try {
      // Use production WebSocket URL for Vercel
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'https://nitesh-handicraft.vercel.app' 
        : 'http://localhost:3000'

      this.socket = io(wsUrl, {
        transports: ['websocket', 'polling'], // Fallback to polling for Vercel
        upgrade: true,
        timeout: 5000,
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
      })

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected:', this.socket?.id)
        this.reconnectAttempts = 0
        
        // Auto-join based on user type
        if (isAdmin && userId) {
          this.socket?.emit('admin-join', userId)
        }
        
        // Store socket globally for cache invalidation
        if (typeof window !== 'undefined') {
          (window as any).socket = this.socket
        }
      })

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason)
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          this.reconnect()
        }
      })

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error)
        this.handleReconnect()
      })

      // Listen for real-time data updates
      this.socket.on('data-update', (update) => {
        console.log('📡 Real-time update received:', update)
        // Dispatch custom event for components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('realtime-update', { 
            detail: update 
          }))
        }
      })

      return this.socket
    } catch (error) {
      console.error('❌ WebSocket initialization error:', error)
      return null
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(this.reconnectDelay * this.reconnectAttempts, 5000)
      console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)
      
      setTimeout(() => {
        this.reconnect()
      }, delay)
    } else {
      console.error('❌ Max reconnection attempts reached')
    }
  }

  private reconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.connect()
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.reconnectAttempts = 0
      
      // Clean up global reference
      if (typeof window !== 'undefined') {
        delete (window as any).socket
      }
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('⚠️ Socket not connected, cannot emit:', event)
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient()

// Hook for React components
export function useWebSocket(userId?: string, isAdmin = false) {
  const socket = wsClient.connect(userId, isAdmin)
  
  return {
    socket,
    isConnected: wsClient.isConnected(),
    emit: wsClient.emit.bind(wsClient),
    on: wsClient.on.bind(wsClient),
    off: wsClient.off.bind(wsClient),
    disconnect: wsClient.disconnect.bind(wsClient)
  }
}
