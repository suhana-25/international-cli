'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getWebSocketUrl } from '@/lib/utils/websocket-url'

export default function TestAdminChatPage() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Chat Test</h1>
      
      {/* Total Online Users Counter */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Total Online Users: {totalOnline}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Offline Users: {totalOffline}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-green-600 dark:text-green-400">Real-time</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <p className="text-sm text-gray-600">
              WebSocket Status: {isConnected ? '🟢 Online' : '🔴 Offline'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Connection Status:</strong> {connectionStatus}
            </p>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card>
          <CardHeader>
            <CardTitle>Online Users ({onlineUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {onlineUsers.length === 0 ? (
              <p className="text-gray-500">No online users</p>
            ) : (
              <div className="space-y-2">
                                 {onlineUsers.map((user, index) => (
                   <div
                     key={index}
                     className={`p-3 rounded cursor-pointer flex items-center justify-between ${
                       selectedUser === user.userName ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'
                     }`}
                     onClick={() => setSelectedUser(user.userName)}
                   >
                     <div className="flex-1">
                       <div className="font-medium">{user.userName}</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400">{user.userEmail}</div>
                       <div className="text-xs text-green-600 dark:text-green-400">🟢 Online</div>
                     </div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                 ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Users */}
        <Card>
          <CardHeader>
            <CardTitle>Offline Users ({offlineUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {offlineUsers.length === 0 ? (
              <p className="text-gray-500">No offline users</p>
            ) : (
              <div className="space-y-2">
                                 {offlineUsers.map((user, index) => (
                   <div
                     key={index}
                     className={`p-3 rounded cursor-pointer flex items-center justify-between ${
                       selectedUser === user.userName ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'
                     }`}
                     onClick={() => setSelectedUser(user.userName)}
                   >
                     <div className="flex-1">
                       <div className="font-medium">{user.userName}</div>
                       <div className="text-xs text-gray-500 dark:text-gray-400">{user.userEmail}</div>
                       <div className="text-xs text-red-600 dark:text-red-400">🔴 Offline</div>
                     </div>
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   </div>
                 ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
                      <div className="space-y-2 text-sm">
              <p><strong>WebSocket ID:</strong> {socket?.id || 'Not connected'}</p>
              <p><strong>Connection Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
              <p><strong>Online Users:</strong> {onlineUsers.length}</p>
              <p><strong>Offline Users:</strong> {offlineUsers.length}</p>
              <p><strong>Total Users:</strong> {onlineUsers.length + offlineUsers.length}</p>
              <p><strong>Selected User:</strong> {selectedUser || 'None'}</p>
              <p><strong>Last Update:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={!message.trim() || !selectedUser}>
                Send to {selectedUser || 'User'}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={sendToAll} 
                disabled={!message.trim()}
                variant="outline"
              >
                Send to All Users
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Selected User:</strong> {selectedUser || 'None'}</p>
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Open the test chat page in another tab</li>
                <li>Enter your name and start chatting</li>
                <li>Come back here and select your user from the list</li>
                <li>Send a message and see it appear in your chat</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
