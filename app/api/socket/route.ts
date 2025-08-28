import { NextRequest, NextResponse } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'

// WebSocket server for real-time sync
let io: SocketIOServer | null = null

// Initialize WebSocket server
function initializeWebSocket() {
  if (io) return io

  try {
    io = new SocketIOServer(3001, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "https://niteshhandicraft.vercel.app",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    })

    io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id)

      // Handle admin actions
      socket.on('admin_action', (event) => {
        console.log('📡 Admin action received:', event)
        
        // Broadcast to all connected clients
        socket.broadcast.emit('sync_event', {
          ...event,
          timestamp: Date.now()
        })
        
        // Also emit back to sender for confirmation
        socket.emit('sync_confirmed', {
          ...event,
          timestamp: Date.now()
        })
      })

      // Handle client subscriptions
      socket.on('subscribe', (type) => {
        socket.join(type)
        console.log(`📡 Client ${socket.id} subscribed to ${type}`)
      })

      // Handle client unsubscriptions
      socket.on('unsubscribe', (type) => {
        socket.leave(type)
        console.log(`📡 Client ${socket.id} unsubscribed from ${type}`)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id)
      })
    })

    console.log('✅ WebSocket server initialized on port 3001')
    return io
  } catch (error) {
    console.error('❌ Failed to initialize WebSocket server:', error)
    return null
  }
}

// GET endpoint for WebSocket connection info
export async function GET(request: NextRequest) {
  try {
    const server = initializeWebSocket()
    
    if (!server) {
      return NextResponse.json({ 
        error: 'WebSocket server not available' 
      }, { status: 500 })
    }

    const connectedClients = server.engine.clientsCount
    
    return NextResponse.json({
      status: 'running',
      connectedClients,
      port: 3001,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('❌ WebSocket status check failed:', error)
    return NextResponse.json({ 
      error: 'WebSocket server error' 
    }, { status: 500 })
  }
}

// POST endpoint for manual sync events
export async function POST(request: NextRequest) {
  try {
    const server = initializeWebSocket()
    
    if (!server) {
      return NextResponse.json({ 
        error: 'WebSocket server not available' 
      }, { status: 500 })
    }

    const event = await request.json()
    
    // Validate event
    if (!event.type || !event.action || !event.id) {
      return NextResponse.json({ 
        error: 'Invalid event format' 
      }, { status: 400 })
    }

    // Broadcast to all connected clients
    server.emit('sync_event', {
      ...event,
      timestamp: Date.now()
    })

    console.log('📡 Manual sync event broadcasted:', event)

    return NextResponse.json({
      success: true,
      message: 'Event broadcasted successfully',
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('❌ Manual sync event failed:', error)
    return NextResponse.json({ 
      error: 'Failed to broadcast event' 
    }, { status: 500 })
  }
}

