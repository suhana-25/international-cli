'use client'

import React, { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { MessageCircle, Send, Users, Clock, CheckCircle, XCircle, Mail, User, Search, RefreshCw, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { getWebSocketUrl } from '@/lib/utils/websocket-url'

interface ChatMessage {
  id: string
  sessionId: string
  senderType: 'user' | 'admin'
  senderId: string
  senderName: string
  message: string
  messageType: string
  isRead: boolean
  createdAt: Date
}

interface ChatUser {
  sessionId: string
  userId: string
  userName: string
  userEmail: string
  isOnline: boolean
  lastSeen: Date
  joinedAt: Date
  unreadCount: number
}

interface AdminChatClientProps {
  adminId: string
  adminName: string
}

export default function AdminChatClient({ adminId, adminName }: AdminChatClientProps) {
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([])
  const [offlineUsers, setOfflineUsers] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userTyping, setUserTyping] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [totalOnline, setTotalOnline] = useState(0)
  const [totalOffline, setTotalOffline] = useState(0)
  
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize socket connection
  useEffect(() => {
    // Check if we're on Vercel
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    
    if (isVercel) {
      console.log('⚠️ Admin chat not available on Vercel deployment')
      toast({
        title: 'Chat Unavailable',
        description: 'Admin chat is not available on the deployed version. Please visit the local development version.',
        duration: 5000,
      })
      return
    }
    
    const socket = io(getWebSocketUrl(), {
      transports: ['websocket']
    })

    socket.on('connect', () => {
      console.log('🔌 Admin connected to WebSocket')
      setIsConnected(true)
      socket.emit('admin-join', adminId)
    })

    socket.on('disconnect', () => {
      console.log('🔌 Admin disconnected from WebSocket')
      setIsConnected(false)
    })

    socket.on('user-joined', (data: ChatUser) => {
      console.log('👤 User joined:', data)
      // User will be added via active-users-update event
    })

    socket.on('user-left', (data: ChatUser) => {
      console.log('👋 User left:', data)
      // User will be updated via active-users-update event
    })

    socket.on('user-idle', (data: ChatUser) => {
      console.log('😴 User went idle:', data)
      // User will be updated via active-users-update event
    })

    socket.on('active-users-update', (data: any) => {
      console.log('📊 Active users update:', data)
      
      // Process online users
      const onlineUsers = (data.online?.users || []).map((user: any) => {
        // Check if this is a real signed-in user or a guest
        const hasRealName = user.userName && !user.userName.startsWith('Guest_') && user.userName.length > 5
        const hasRealEmail = user.userEmail && !user.userEmail.includes('guest_') && user.userEmail.includes('@')
        
        // If user has real name/email, use it; otherwise generate guest info
        let finalUserName, finalUserEmail
        
        if (hasRealName && hasRealEmail) {
          // This is a signed-in user with real data
          finalUserName = user.userName
          finalUserEmail = user.userEmail
        } else {
          // This is a guest user, generate random info
          const guestId = Math.random().toString(36).substr(2, 5)
          finalUserName = `Guest_${guestId}`
          finalUserEmail = `guest_${guestId}@example.com`
        }
        
        return {
          sessionId: user.sessionId || 'unknown',
          userId: user.userId || 'unknown',
          userName: finalUserName,
          userEmail: finalUserEmail,
          isOnline: true,
          lastSeen: user.lastSeen ? new Date(user.lastSeen) : new Date(),
          joinedAt: user.joinedAt ? new Date(user.joinedAt) : new Date(),
          unreadCount: user.unreadCount || 0
        }
      })
      
      // Process offline users
      const offlineUsers = (data.offline?.users || []).map((user: any) => {
        // Check if this is a real signed-in user or a guest
        const hasRealName = user.userName && !user.userName.startsWith('Guest_') && user.userName.length > 5
        const hasRealEmail = user.userEmail && !user.userEmail.includes('guest_') && user.userEmail.includes('@')
        
        // If user has real name/email, use it; otherwise generate guest info
        let finalUserName, finalUserEmail
        
        if (hasRealName && hasRealEmail) {
          // This is a signed-in user with real data
          finalUserName = user.userName
          finalUserEmail = user.userEmail
        } else {
          // This is a guest user, generate random info
          const guestId = Math.random().toString(36).substr(2, 5)
          finalUserName = `Guest_${guestId}`
          finalUserEmail = `guest_${guestId}@example.com`
        }
        
        return {
          sessionId: user.sessionId || 'unknown',
          userId: user.userId || 'unknown',
          userName: finalUserName,
          userEmail: finalUserEmail,
          isOnline: false,
          lastSeen: user.lastSeen ? new Date(user.lastSeen) : new Date(),
          joinedAt: user.joinedAt ? new Date(user.joinedAt) : new Date(),
          unreadCount: user.unreadCount || 0
        }
      })
      
      setOnlineUsers(onlineUsers)
      setOfflineUsers(offlineUsers)
      setTotalOnline(data.total?.online || 0)
      setTotalOffline(data.total?.offline || 0)
      
      console.log('✅ Processed users:', { onlineUsers, offlineUsers })
    })

    socket.on('user-message', (data: ChatMessage) => {
      console.log('📨 User message received:', data)
      if (selectedUser && data.sessionId === selectedUser.sessionId) {
        setMessages(prev => [...prev, data])
        scrollToBottom()
      }
      // Update unread count for the user
      updateUserUnreadCount(data.sessionId, 1)
    })

    socket.on('typing-start', (data: any) => {
      if (data.senderType === 'user' && selectedUser && data.sessionId === selectedUser.sessionId) {
        setUserTyping(data.userName)
      }
    })

    socket.on('typing-stop', (data: any) => {
      if (data.senderType === 'user' && selectedUser && data.sessionId === selectedUser.sessionId) {
        setUserTyping(null)
      }
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [adminId, selectedUser?.sessionId])

  // Update user unread count
  const updateUserUnreadCount = (sessionId: string, increment: number) => {
    setOnlineUsers(prev => prev.map(user => 
      user.sessionId === sessionId 
        ? { ...user, unreadCount: user.unreadCount + increment }
        : user
    ))
    setOfflineUsers(prev => prev.map(user => 
      user.sessionId === sessionId 
        ? { ...user, unreadCount: user.unreadCount + increment }
        : user
    ))
  }

  // Handle typing
  const handleTyping = () => {
    if (!selectedUser || !socketRef.current) return
    
    setIsTyping(true)
    socketRef.current.emit('typing-start', {
      sessionId: selectedUser.sessionId,
      adminId: adminId,
      adminName: adminName
    })

    // Stop typing after 2 seconds
    setTimeout(() => {
      setIsTyping(false)
      socketRef.current?.emit('typing-stop', {
        sessionId: selectedUser.sessionId,
        adminId: adminId
      })
    }, 2000)
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedUser || !socketRef.current) return

    const message = inputMessage.trim()
    setInputMessage('')

    // Create message object
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sessionId: selectedUser.sessionId,
      senderType: 'admin',
      senderId: adminId,
      senderName: adminName,
      message,
      messageType: 'text',
      isRead: true,
      createdAt: new Date()
    }

    // Add to local messages
    setMessages(prev => [...prev, newMessage])

    // Send via WebSocket with targetUserId for proper routing
    socketRef.current.emit('admin-message', {
      sessionId: selectedUser.sessionId,
      adminId: adminId,
      adminName: adminName,
      message,
      targetUserId: selectedUser.userId // Add this for proper routing
    })

    // Clear unread count for this user
    updateUserUnreadCount(selectedUser.sessionId, -selectedUser.unreadCount)

    scrollToBottom()
  }

  // Handle user selection
  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user)
    setMessages([]) // Clear previous messages
    // Clear unread count for this user
    updateUserUnreadCount(user.sessionId, -user.unreadCount)
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Filter users based on search
  const filteredOnlineUsers = onlineUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredOfflineUsers = offlineUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Left Panel - Users List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Total Online Users Counter */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Total Online Users: {totalOnline}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  Offline: {totalOffline}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-green-600 dark:text-green-400">Real-time</span>
              </div>
            </div>
            {/* Debug Info */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div>Online Users: {onlineUsers.length}</div>
              <div>Offline Users: {offlineUsers.length}</div>
              <div>Total Users: {onlineUsers.length + offlineUsers.length}</div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>Online Users ({filteredOnlineUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOnlineUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No online users
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOnlineUsers.map((user, index) => (
                  <div
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedUser?.sessionId === user.sessionId ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium flex items-center space-x-2">
                          <span className="text-gray-900 dark:text-white">{user.userName}</span>
                          {user.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {user.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.userEmail}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Online • Joined: {formatTime(user.joinedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span>Offline Users ({filteredOfflineUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOfflineUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No offline users
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOfflineUsers.map((user, index) => (
                  <div
                    key={index}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedUser?.sessionId === user.sessionId ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium flex items-center space-x-2">
                          <span className="text-gray-900 dark:text-white">{user.userName}</span>
                          {user.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {user.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.userEmail}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400 flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span>Offline • Last seen: {formatTime(user.lastSeen)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-gray-900 dark:text-white">{selectedUser.userName}</span>
                      <div className={`w-2 h-2 rounded-full ${selectedUser.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.userEmail}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {selectedUser.isOnline ? '🟢 Online' : '🔴 Offline'} • 
                      {selectedUser.isOnline ? ` Joined: ${formatTime(selectedUser.joinedAt)}` : ` Last seen: ${formatTime(selectedUser.lastSeen)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      selectedUser.isOnline 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedUser.isOnline ? '🟢 Online' : '🔴 Offline'}
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            message.senderType === 'admin'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="text-sm">{message.message}</div>
                          <div className={`text-xs mt-1 ${
                            message.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.senderName} • {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                                         ))}
                     
                     {/* User Typing Indicator */}
                     {userTyping && (
                       <div className="flex justify-start">
                         <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                           <div className="text-sm text-gray-500 italic flex items-center space-x-2">
                             <div className="flex space-x-1">
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                             </div>
                             <span>{userTyping} is typing...</span>
                           </div>
                         </div>
                       </div>
                     )}
                     
                     <div ref={messagesEndRef} />
                   </div>
                 )}
               </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    onInput={handleTyping}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={!selectedUser.isOnline}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputMessage.trim() || !selectedUser.isOnline}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {!selectedUser.isOnline && (
                  <p className="text-xs text-red-500 mt-2">
                    User is offline. Message will be delivered when they come online.
                  </p>
                )}
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Chat Selected
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Select a user from the left to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
