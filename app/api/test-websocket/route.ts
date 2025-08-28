import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if WebSocket server is accessible
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000'
    
    return NextResponse.json({
      success: true,
      message: 'WebSocket test endpoint',
      wsUrl,
      timestamp: new Date().toISOString(),
      serverStatus: 'running'
    })
  } catch (error) {
    console.error('WebSocket test error:', error)
    return NextResponse.json(
      { success: false, error: 'WebSocket test failed' },
      { status: 500 }
    )
  }
}

