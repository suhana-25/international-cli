'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { wsClient } from '@/lib/websocket-client'

interface RealTimeContextType {
  isConnected: boolean
  lastUpdate: any
  forceUpdate: (type: string) => void
}

const RealTimeContext = createContext<RealTimeContextType>({
  isConnected: false,
  lastUpdate: null,
  forceUpdate: () => {}
})

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<any>(null)

  useEffect(() => {
    // Connect WebSocket based on user session
    const socket = wsClient.connect(
      session?.user?.id, 
      session?.user?.role === 'admin'
    )

    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true)
        console.log('🔌 Real-time connected')
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
        console.log('🔌 Real-time disconnected')
      })
    }

    // Listen for real-time updates
    const handleRealTimeUpdate = (event: any) => {
      setLastUpdate(event.detail)
      console.log('📡 Real-time update:', event.detail)
    }

    window.addEventListener('realtime-update', handleRealTimeUpdate)

    return () => {
      window.removeEventListener('realtime-update', handleRealTimeUpdate)
    }
  }, [session])

  const forceUpdate = (type: string) => {
    // Trigger manual update for specific data type
    setLastUpdate({ type, timestamp: Date.now(), manual: true })
  }

  return (
    <RealTimeContext.Provider value={{ isConnected, lastUpdate, forceUpdate }}>
      {children}
    </RealTimeContext.Provider>
  )
}

export const useRealTime = () => useContext(RealTimeContext)
