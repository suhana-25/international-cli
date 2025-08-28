'use client'

import React, { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createChatSession, sendMessage } from '@/lib/actions/chat.actions'
import { useToast } from '@/components/ui/use-toast'
// import { useSession } from 'next-auth/react' // Removed - using custom auth
import Link from 'next/link'
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

interface ChatWidgetProps {
  userId?: string
  userName?: string
  userEmail?: string
}

export default function ChatWidget({ userId, userName, userEmail }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [adminTyping, setAdminTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  // const { data: session } = useSession() // Removed - using custom auth
  const session = { user: { id: 'guest', name: 'Guest', email: 'guest@example.com' } } // Mock session for chat

  // Use session data if available, otherwise fall back to props or generate random
  const currentUserId = userId || session?.user?.id || `user_${Math.random().toString(36).substr(2, 9)}`
  const currentUserName = userName || session?.user?.name || guestName || `Guest_${Math.random().toString(36).substr(2, 5)}`
  const currentUserEmail = userEmail || session?.user?.email || undefined

  // Debug logging
  console.log('🔍 Chat Widget Debug:', {
    session: session,
    userId: userId,
    userName: userName,
    userEmail: userEmail,
    sessionUserId: session?.user?.id,
    sessionUserName: session?.user?.name,
    sessionUserEmail: session?.user?.email,
    finalUserId: currentUserId,
    finalUserName: currentUserName,
    finalUserEmail: currentUserEmail
  })

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && sessionId) {
      initializeSocket()
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = async () => {
    try {
      setIsLoading(true)
      const result = await createChatSession({
        userId: currentUserId,
        userName: currentUserName,
        userEmail: currentUserEmail,
        userAgent: navigator.userAgent,
      })

      if (result.success && result.data) {
        setSessionId(result.data.id)
        console.log('✅ Chat session created:', result.data.id)
        console.log('👤 User info:', { currentUserId, currentUserName, currentUserEmail })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to initialize chat',
        })
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initialize chat',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeSocket = () => {
    if (!sessionId) return

    try {
      // Check if we're on Vercel
      const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
      
      if (isVercel) {
        console.log('⚠️ Chat not available on Vercel deployment')
        setIsConnected(false)
        toast({
          title: 'Chat Unavailable',
          description: 'Live chat is not available on the deployed version. Please visit the local development version for full chat functionality.',
          duration: 5000,
        })
        return
      }
      
      // Connect to WebSocket server
      socketRef.current = io(getWebSocketUrl(), {
        transports: ['websocket']
      })

      socketRef.current.on('connect', () => {
        console.log('🔌 Connected to WebSocket server')
        setIsConnected(true)
        
        // Join chat session
        socketRef.current?.emit('join-session', {
          sessionId,
          userId: currentUserId,
          userName: currentUserName
        })
      })

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Disconnected from WebSocket server')
        setIsConnected(false)
      })

      // Listen for admin messages
      socketRef.current.on('admin-message', (message: ChatMessage) => {
        console.log('📨 Admin message received:', message)
        setMessages(prev => [...prev, message])
        
        // Simple notification
        if (!isOpen) {
          setHasNewMessages(true)
          setUnreadCount(prev => prev + 1)
          toast({
            title: 'New Message',
            description: `${message.senderName} sent you a message`,
            duration: 3000
          })
        }
      })

      // Listen for user messages
      socketRef.current.on('user-message', (message: ChatMessage) => {
        console.log('📨 User message received:', message)
        if (message.senderId !== currentUserId) {
          setMessages(prev => [...prev, message])
        }
      })

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error)
        setIsConnected(false)
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Failed to connect to chat server',
        })
      })
    } catch (error) {
      console.error('❌ Error initializing socket:', error)
      setIsConnected(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return

    const message = inputMessage.trim()
    setInputMessage('')
    setIsTyping(false)

    try {
      // Send via WebSocket for real-time
      socketRef.current?.emit('user-message', {
        sessionId,
        userId: currentUserId,
        userName: currentUserName,
        message
      })

      // Save to database
      await sendMessage({
        sessionId,
        senderType: 'user',
        senderId: currentUserId,
        senderName: currentUserName,
        message
      })

      // Add message to local state
      const newMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        sessionId,
        senderType: 'user',
        senderId: currentUserId,
        senderName: currentUserName,
        message,
        messageType: 'text',
        isRead: true,
        createdAt: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message',
      })
    }
  }

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleChat = () => {
    if (!isOpen) {
      // If user is not logged in and no guest name, show name input first
      if (!session?.user?.name && !guestName) {
        setShowNameInput(true)
        return
      }
      setIsOpen(true)
      setIsMinimized(false)
      
      // Clear notifications when chat is opened
      setHasNewMessages(false)
      setUnreadCount(0)
    } else {
      setIsOpen(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={toggleChat}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Notification Badge */}
          {hasNewMessages && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show name input for guest users
  if (showNameInput && !session?.user?.name && !guestName) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80">
          <div className="text-center mb-4">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome to Live Chat!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Please enter your name to continue</p>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Enter your name..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && guestName.trim() && setShowNameInput(false)}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowNameInput(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowNameInput(false)}
                disabled={!guestName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Live Chat Support</div>
              <div className="text-xs text-blue-100 flex items-center gap-2">
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Connecting...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-100 text-right">
            <div className="font-medium">{currentUserName}</div>
            {!session?.user?.id && (
              <span className="text-blue-200">(Guest)</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMinimize}
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
                         {/* Messages */}
             <div className="flex-1 p-4 space-y-3 overflow-y-auto h-[380px] bg-gray-50 dark:bg-gray-800">
               {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                   <div className="text-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                     <div className="text-gray-500">Initializing chat...</div>
                   </div>
                 </div>
               ) : messages.length === 0 ? (
                 <div className="text-center text-gray-500 py-8">
                   <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <MessageCircle className="h-8 w-8 text-blue-600" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to Live Chat!</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Start a conversation and we'll respond as soon as possible.</p>
                   {!session?.user?.id && (
                     <div className="mt-4">
                       <Link href="/auth/sign-in">
                         <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800">
                           Sign In for Better Experience
                         </Button>
                       </Link>
                     </div>
                   )}
                 </div>
               ) : (
                 messages.map((message) => (
                   <div
                     key={message.id}
                     className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                     <div
                       className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                         message.senderType === 'user'
                           ? 'bg-blue-600 text-white rounded-br-md'
                           : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600'
                       }`}
                     >
                       <div className="text-sm leading-relaxed">{message.message}</div>
                       <div className={`text-xs mt-2 flex items-center justify-end gap-1 ${
                         message.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'
                       }`}>
                         {formatTime(message.createdAt)}
                         {message.senderType === 'user' && (
                           <div className="w-3 h-3">
                             <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                               <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                             </svg>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))
               )}
              
              {/* Typing indicator */}
              {adminTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Admin is typing...
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

                         {/* Input */}
             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
               <div className="flex items-end space-x-3">
                 <div className="flex-1 relative">
                   <Input
                     value={inputMessage}
                     onChange={(e) => {
                       setInputMessage(e.target.value)
                       handleTyping()
                     }}
                     onKeyPress={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault()
                         handleSendMessage()
                       }
                     }}
                     placeholder="Type your message..."
                     className="pr-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl"
                     disabled={!isConnected || isLoading}
                   />
                   {isTyping && (
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                       typing...
                     </div>
                   )}
                 </div>
                 <Button
                   onClick={handleSendMessage}
                   disabled={!inputMessage.trim() || !isConnected || isLoading}
                   size="sm"
                   className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
                 >
                   <Send className="h-4 w-4" />
                 </Button>
               </div>
               <div className="text-xs text-gray-500 mt-2 text-center">
                 Press Enter to send, Shift+Enter for new line
               </div>
             </div>
          </>
        )}
      </div>
    </div>
  )
}
