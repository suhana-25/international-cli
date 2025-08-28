'use client'

import React, { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Phone,
  Mail,
  Clock,
  User,
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  HeartHandshake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createChatSession, sendMessage } from '@/lib/actions/chat.actions'
import { useToast } from '@/components/ui/use-toast'
// import { useSession } from 'next-auth/react' // Removed - using custom auth
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

interface ModernChatWidgetProps {
  userId?: string
  userName?: string
  userEmail?: string
}

export default function ModernChatWidget({ userId, userName, userEmail }: ModernChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [adminTyping, setAdminTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [guestName, setGuestName] = useState('')
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showQuickActions, setShowQuickActions] = useState(false)
  
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  // const { data: session } = useSession() // Removed - using custom auth
  const session = { user: { id: 'guest', name: 'Guest', email: 'guest@example.com' } } // Mock session for chat

  // Use session data if available
  const currentUserId = userId || session?.user?.id || `guest_${Math.random().toString(36).substr(2, 9)}`
  const currentUserName = userName || session?.user?.name || guestName || `Guest User`
  const currentUserEmail = userEmail || session?.user?.email || undefined

  // Quick action suggestions
  const quickActions = [
    { icon: "💬", text: "General Question", message: "Hi! I have a general question about your products." },
    { icon: "📦", text: "Order Status", message: "I'd like to check the status of my order." },
    { icon: "💳", text: "Payment Help", message: "I need help with payment or billing." },
    { icon: "🚚", text: "Shipping Info", message: "Can you tell me about shipping options?" },
    { icon: "🔄", text: "Returns", message: "I need information about returns and exchanges." },
    { icon: "💡", text: "Product Info", message: "I need more details about a specific product." }
  ]

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
        console.log('✅ Modern chat session created:', result.data.id)
      } else {
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Unable to start chat. Please try again.',
        })
      }
    } catch (error) {
      console.error('Error initializing modern chat:', error)
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Unable to start chat. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeSocket = () => {
    if (!sessionId) return

    try {
      const wsUrl = getWebSocketUrl()
      socketRef.current = io(wsUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      })

      socketRef.current.on('connect', () => {
        console.log('🔗 Modern chat connected to WebSocket')
        setIsConnected(true)
        socketRef.current?.emit('join-chat', { sessionId, userId: currentUserId })
      })

      socketRef.current.on('disconnect', () => {
        console.log('❌ Modern chat disconnected from WebSocket')
        setIsConnected(false)
      })

      socketRef.current.on('new-message', (message: ChatMessage) => {
        console.log('📨 New message received:', message)
        setMessages(prev => [...prev, message])
        
        if (message.senderType === 'admin' && (!isOpen || isMinimized)) {
          setHasNewMessages(true)
          setUnreadCount(prev => prev + 1)
          
          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification('New message from support', {
              body: message.message,
              icon: '/favicon.ico',
            })
          }
        }
      })

      socketRef.current.on('admin-typing', ({ isTyping: typing }: { isTyping: boolean }) => {
        setAdminTyping(typing)
      })

      socketRef.current.on('error', (error: any) => {
        console.error('WebSocket error:', error)
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Chat connection lost. Trying to reconnect...',
        })
      })

    } catch (error) {
      console.error('Error initializing socket:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return

    const messageText = inputMessage.trim()
    setInputMessage('')
    setShowQuickActions(false)
    setShowWelcome(false)

    try {
      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        sessionId,
        senderType: 'user',
        senderId: currentUserId,
        senderName: currentUserName,
        message: messageText,
        messageType: 'text',
        isRead: false,
        createdAt: new Date(),
      }

      setMessages(prev => [...prev, tempMessage])

      const result = await sendMessage({
        sessionId,
        senderType: 'user',
        senderId: currentUserId,
        senderName: currentUserName,
        message: messageText,
        messageType: 'text',
      })

      if (!result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
        toast({
          variant: 'destructive',
          title: 'Send Failed',
          description: 'Message could not be sent. Please try again.',
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: 'Message could not be sent. Please try again.',
      })
    }
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputMessage(action.message)
    setShowQuickActions(false)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleTyping = () => {
    if (!socketRef.current) return

    setIsTyping(true)
    socketRef.current.emit('user-typing', { sessionId, isTyping: true })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socketRef.current?.emit('user-typing', { sessionId, isTyping: false })
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMessages(false)
      setUnreadCount(0)
      setIsMinimized(false)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg border-2 border-white transition-all duration-200 hover:scale-105 relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {hasNewMessages && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl border transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src="/support-avatar.png" />
                  <AvatarFallback className="bg-white text-blue-600 font-bold">
                    <HeartHandshake className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Support Team</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-green-400 text-green-400" />
                  {isConnected ? 'Online' : 'Connecting...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-96 bg-gray-50">
                {/* Welcome Message */}
                {showWelcome && messages.length === 0 && (
                  <div className="text-center space-y-4 py-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-lg text-gray-800">
                        Welcome to Support Chat! 👋
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 mb-2">
                          Hi <span className="font-semibold text-blue-600">{currentUserName}</span>!
                        </p>
                        <p className="text-sm text-gray-600">
                          How can we help you today?
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowQuickActions(!showQuickActions)}
                          className="bg-blue-600 text-white border-0 hover:bg-blue-700"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Quick Help
                        </Button>
                        <p className="text-xs text-gray-500">
                          Usually reply within 5 minutes
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {showQuickActions && (
                  <div className="space-y-3 mb-4">
                    <div className="text-center">
                      <h5 className="font-semibold text-gray-700 mb-2">Choose your topic:</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          className="h-auto p-3 text-left border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex flex-col items-center space-y-1 w-full">
                            <span className="text-lg">{action.icon}</span>
                            <span className="text-xs font-medium text-gray-700 text-center leading-tight">{action.text}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuickActions(false)}
                        className="text-gray-500 text-xs hover:text-gray-700"
                      >
                        ✕ Close
                      </Button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                      message.senderType === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`flex items-center justify-between mt-1 text-xs ${
                        message.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.createdAt)}</span>
                        {message.senderType === 'user' && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Admin Typing */}
                {adminTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white rounded-b-2xl">
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
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl pr-12"
                      disabled={!isConnected || isLoading}
                    />
                    {isTyping && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-500 font-medium">
                        typing...
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || !isConnected || isLoading}
                    className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • We typically reply within 5 minutes
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
