// Simplified sync system for basic data synchronization
// Uses simple polling for reliability without complex WebSocket connections

export interface SyncEvent {
  type: 'product' | 'category' | 'gallery' | 'blog' | 'user' | 'order'
  action: 'create' | 'update' | 'delete'
  id: string
  data?: any
  timestamp: number
}

export interface SyncState {
  isConnected: boolean
  lastSync: number
  pendingEvents: SyncEvent[]
}

class SimpleSync {
  private pollingInterval: NodeJS.Timeout | null = null
  private eventHandlers: Map<string, Set<(event: SyncEvent) => void>> = new Map()
  private syncState: SyncState = {
    isConnected: true, // Always connected with polling
    lastSync: Date.now(),
    pendingEvents: []
  }

  // Configuration
  private readonly POLLING_INTERVAL = 10000 // 10 seconds

  constructor() {
    this.initializeSync()
  }

  private initializeSync() {
    // Start polling immediately
    this.startPolling()
  }

  private startPolling() {
    if (this.pollingInterval) return
    
    console.log('🔄 Starting simple polling sync...')
    this.pollingInterval = setInterval(() => {
      this.pollForUpdates()
    }, this.POLLING_INTERVAL)
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
      console.log('🔄 Stopped polling')
    }
  }

  private async pollForUpdates() {
    try {
      // Get the current origin for proper URL construction
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const pollUrl = `${baseUrl}/api/sync/poll`
      
      const response = await fetch(pollUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      if (response.ok) {
        const events = await response.json()
        if (Array.isArray(events) && events.length > 0) {
          events.forEach(event => this.handleSyncEvent(event))
          this.syncState.lastSync = Date.now()
        }
      }
    } catch (error) {
      console.error('❌ Polling error:', error)
    }
  }

  private handleSyncEvent(event: SyncEvent) {
    // Notify all registered handlers
    const handlers = this.eventHandlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          console.error('❌ Event handler error:', error)
        }
      })
    }

    // Update last sync time
    this.syncState.lastSync = event.timestamp
  }

  // Public API methods

  public subscribe(type: string, handler: (event: SyncEvent) => void) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, new Set())
    }
    
    this.eventHandlers.get(type)!.add(handler)
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(type)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.eventHandlers.delete(type)
        }
      }
    }
  }

  public emit(event: SyncEvent) {
    // Store for later processing
    this.syncState.pendingEvents.push(event)
    console.log('📝 Stored event for sync:', event)
  }

  public getState(): SyncState {
    return { ...this.syncState }
  }

  public disconnect() {
    this.stopPolling()
    this.syncState.isConnected = false
  }
}

// Create singleton instance
export const realtimeSync = new SimpleSync()

// Export for use in components
export default realtimeSync
