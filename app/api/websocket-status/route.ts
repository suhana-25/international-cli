import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the WebSocket server instance
    const { wsServer } = require('../../../lib/websocket-server.js')
    
    // Get connection info
    const userConnections = wsServer.userConnections
    const adminSessions = wsServer.adminSessions
    const activeUsers = wsServer.activeUsers
    
    const status = {
      timestamp: new Date().toISOString(),
      userConnections: {
        total: userConnections.size,
        details: Array.from(userConnections.entries()).map((entry: any) => ({
          socketId: entry[0],
          userData: entry[1]
        }))
      },
      adminSessions: {
        total: adminSessions.size,
        details: Array.from(adminSessions.entries()).map((entry: any) => ({
          adminId: entry[0],
          socketId: entry[1]
        }))
      },
      activeUsers: {
        total: activeUsers.size,
        details: Array.from(activeUsers.entries()).map((entry: any) => ({
          userId: entry[0],
          userData: entry[1]
        }))
      },
      summary: {
        totalConnections: userConnections.size + adminSessions.size,
        onlineUsers: activeUsers.size,
        offlineUsers: userConnections.size - activeUsers.size,
        activeAdmins: adminSessions.size
      }
    }
    
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error getting WebSocket status:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { error: 'Failed to get WebSocket status', details: errorMessage },
      { status: 500 }
    )
  }
}

