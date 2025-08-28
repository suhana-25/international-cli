'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getWebSocketUrl } from '@/lib/utils/websocket-url'

export default function TestAdminChatClient() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [offlineUsers, setOfflineUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [totalOnline, setTotalOnline] = useState(0)
  const [totalOffline, setTotalOffline] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')

  useEffect(() => {
    // Check if we're on Vercel
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    
    if (isVercel) {
      console.log('⚠️ Test admin chat not available on Vercel deployment')
      setConnectionStatus('Chat not available on Vercel')
      return
    }
    
    // Connect to WebSocket as admin
    const newSocket = io(getWebSocketUrl(), {
      transports: ['websocket']
    })

    newSocket.on('connect', () => {
      console.log('✅ Admin connected to WebSocket')
      setIsConnected(true)
      setConnectionStatus('Connected')
      
      // Join admin room
      newSocket.emit('admin-join', 'test-admin')
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Admin disconnected')
      setIsConnected(false)
      setConnectionStatus('Disconnected')
    })

    newSocket.on('user-joined', (data: any) => {
      console.log('👤 User joined:', data)
      // User will be added via active-users-update event
    })

    newSocket.on('user-left', (data: any) => {
      console.log('👋 User left:', data)
      // User will be updated via active-users-update event
    })

    newSocket.on('active-users-update', (data: any) => {
      console.log('📊 Active users update:', data)
      setOnlineUsers(data.online.users || [])
      setOfflineUsers(data.offline.users || [])
      setTotalOnline(data.total.online || 0)
      setTotalOffline(data.total.offline || 0)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !socket) return

    console.log('📤 Sending message to:', selectedUser)
    
    socket.emit('admin-message', {
      sessionId: 'test-session',
      adminId: 'test-admin',
      adminName: 'Admin',
      message: message.trim()
    })

    setMessage('')
  }

  const sendToAll = () => {
    if (!message.trim() || !socket) return

    console.log('📤 Broadcasting message to all users')
    
    socket.emit('admin-message', {
      sessionId: 'test-session',
      adminId: 'test-admin',
      adminName: 'Admin',
      message: message.trim()
    })

    setMessage('')
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
    }
  }

  const reconnect = () => {
    if (socket) {
      socket.connect()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Chat Test</h1>
      <p className="mb-4">This page tests the admin chat functionality.</p>
      
      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">{connectionStatus}</span>
            <div className="ml-auto space-x-2">
              <Button onClick={disconnect} variant="outline" size="sm">
                Disconnect
              </Button>
              <Button onClick={reconnect} variant="outline" size="sm">
                Reconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Online Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online Users ({totalOnline})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {onlineUsers.length === 0 ? (
              <p className="text-muted-foreground">No users online</p>
            ) : (
              <div className="space-y-2">
                {onlineUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="font-medium">{user.name || user.id}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(user.id)}
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              Offline Users ({totalOffline})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offlineUsers.length === 0 ? (
              <p className="text-muted-foreground">No users offline</p>
            ) : (
              <div className="space-y-2">
                {offlineUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{user.name || user.id}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(user.id)}
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Input */}
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
              </div>
              <Button onClick={sendMessage} disabled={!message.trim() || !selectedUser}>
                Send to User
              </Button>
              <Button onClick={sendToAll} disabled={!message.trim()}>
                Send to All
              </Button>
            </div>
            
            {selectedUser && (
              <div className="text-sm text-muted-foreground">
                Selected user: <span className="font-medium">{selectedUser}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open another browser tab and go to <code className="bg-gray-100 px-2 py-1 rounded">/test-chat</code></li>
            <li>Enter a guest name to join the chat</li>
            <li>Come back to this page and select the user from the online users list</li>
            <li>Send a message to test the admin chat functionality</li>
            <li>Check the browser console for connection logs</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
