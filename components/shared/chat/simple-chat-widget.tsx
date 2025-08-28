'use client'

import React, { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { getWebSocketUrl } from '@/lib/utils/websocket-url'

interface ChatMessage {
  id: string
  message: string
  sender: string
  timestamp: Date
}

export default function SimpleChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [userName, setUserName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [isAdminTyping, setIsAdminTyping] = useState(false)
  
  const socketRef = useRef<Socket | null>(null)
  const { toast } = useToast()

  // Generate stable user ID and name that don't change on re-renders
  const userIdRef = useRef(`user_${Math.random().toString(36).substr(2, 9)}`)
  const displayNameRef = useRef('')
  const sessionIdRef = useRef('main-chat-session') // Use consistent session ID
  
  // Update display name when userName changes
  useEffect(() => {
    if (userName && userName.trim() && !userName.startsWith('Guest_')) {
      // This is a real user name
      displayNameRef.current = userName.trim()
    } else {
      // Generate guest name
      displayNameRef.current = `Guest_${Math.random().toString(36).substr(2, 5)}`
    }
  }, [userName])

  // Connect to WebSocket immediately when component mounts
  useEffect(() => {
    initializeSocket()
  }, [])

  // Send heartbeat every 30 seconds when connected
  useEffect(() => {
    if (!isConnected || !socketRef.current) return

    const heartbeatInterval = setInterval(() => {
      socketRef.current?.emit('heartbeat', { userId: userIdRef.current })
    }, 30000)

    return () => clearInterval(heartbeatInterval)
  }, [isConnected])

  const initializeSocket = () => {
    try {
      console.log('🔌 Initializing WebSocket connection...')
      
      // Check if we're on Vercel (production deployment)
      const isVercel = window.location.hostname.includes('vercel.app')
      
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
      
      // Use utility function to get correct WebSocket URL
      const wsUrl = getWebSocketUrl()
      console.log('🌐 WebSocket URL:', wsUrl)
      
      socketRef.current = io(wsUrl, {
        transports: ['websocket']
      })

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to WebSocket server')
        setIsConnected(true)
        
        // Join chat
        console.log('🔌 Emitting join-session with data:', {
          sessionId: sessionIdRef.current,
          userId: userIdRef.current,
          userName: displayNameRef.current,
          userEmail: displayNameRef.current && !displayNameRef.current.startsWith('Guest_') 
            ? `${displayNameRef.current.toLowerCase().replace(/\s+/g, '.')}@example.com` 
            : `guest_${Math.random().toString(36).substr(2, 5)}@example.com`
        })
        
        socketRef.current?.emit('join-session', {
          sessionId: sessionIdRef.current,
          userId: userIdRef.current,
          userName: displayNameRef.current,
          userEmail: displayNameRef.current && !displayNameRef.current.startsWith('Guest_') 
            ? `${displayNameRef.current.toLowerCase().replace(/\s+/g, '.')}@example.com` 
            : `guest_${Math.random().toString(36).substr(2, 5)}@example.com`
        })
      })

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket server')
        setIsConnected(false)
      })

              socketRef.current.on('admin-message', (message: any) => {
          console.log('📨 Admin message received:', message)
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            message: message.message || 'Hello from admin!',
            sender: 'Admin',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, newMessage])
          setIsAdminTyping(false) // Stop typing indicator when message received
        })

        socketRef.current.on('typing-start', (data: any) => {
          if (data.senderType === 'admin') {
            setIsAdminTyping(true)
          }
        })

        socketRef.current.on('typing-stop', (data: any) => {
          if (data.senderType === 'admin') {
            setIsAdminTyping(false)
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

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isConnected) return

    const message = inputMessage.trim()
    setInputMessage('')

    // Add message to local state
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      sender: displayNameRef.current,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])

    // Send via WebSocket
    socketRef.current?.emit('user-message', {
      sessionId: sessionIdRef.current,
      userId: userIdRef.current,
      userName: displayNameRef.current,
      message
    })

    console.log('📤 Message sent:', message)
  }

  const toggleChat = () => {
    if (!isOpen) {
      if (!userName) {
        setShowNameInput(true)
        return
      }
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setShowNameInput(false)
      setIsOpen(true)
    }
  }

  if (showNameInput) {
    // Check if we're on Vercel
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    
    if (isVercel) {
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 w-80">
            <div className="text-center mb-6">
              <div className="relative mx-auto mb-4">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chat Not Available</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live chat is not available on the deployed version
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Why?</strong> Vercel is a serverless platform that doesn't support WebSocket servers.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                  <strong>Solution:</strong> Visit the local development version for full chat functionality.
                </p>
              </div>
              
              <Button 
                onClick={() => setShowNameInput(false)} 
                className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl py-3 shadow-lg transition-all duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 w-80">
          {/* Simple Header */}
          <div className="text-center mb-6">
            <div className="relative mx-auto mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Live Chat!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get instant support from our team</p>
          </div>
          
          {/* Simple Input */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <Button 
              onClick={handleNameSubmit} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userName.trim()}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
          </div>
          
          {/* Footer info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💬 Real-time support • 🔒 Secure chat • ⚡ Instant response
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    // Check if we're on Vercel
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Big Simple Chat Button - No Chapri Colors */}
        <div className="relative">
          {/* Main Chat Button */}
          <Button
            onClick={toggleChat}
            size="lg"
            className="h-20 w-20 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="h-8 w-8 text-white" />
            
            {/* Simple notification badge */}
            {messages.some(msg => msg.sender === 'Admin') && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {messages.filter(msg => msg.sender === 'Admin').length}
              </div>
            )}
          </Button>
          
          {/* Vercel Notice */}
          {isVercel && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              ⚠️ Chat not available on Vercel
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden">
        {/* Simple Clean Header */}
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Live Chat</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
            className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
          
        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Start chatting!</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Send a message to begin the conversation</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === displayNameRef.current ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                    message.sender === displayNameRef.current
                      ? 'bg-blue-600 text-white border border-blue-500/20'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-600'
                  }`}
                >
                  <div className="text-sm font-medium leading-relaxed">{message.message}</div>
                  <div className={`text-xs mt-2 flex items-center space-x-2 ${
                    message.sender === displayNameRef.current ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="font-medium">{message.sender}</span>
                    <span>•</span>
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.sender === displayNameRef.current && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                        <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Simple Admin Typing Indicator */}
          {isAdminTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-lg border border-gray-100 dark:border-gray-600 max-w-[80%]">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">A</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Admin is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value)
                  // Send typing indicator
                  if (socketRef.current && isConnected) {
                    socketRef.current.emit('typing-start', {
                      sessionId: sessionIdRef.current,
                      userId: userIdRef.current,
                      userName: displayNameRef.current
                    })
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                onBlur={() => {
                  // Stop typing indicator when input loses focus
                  if (socketRef.current && isConnected) {
                    socketRef.current.emit('typing-stop', {
                      sessionId: sessionIdRef.current,
                      userId: userIdRef.current
                    })
                  }
                }}
                placeholder="Type your message..."
                className="h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 pr-12"
                disabled={!isConnected}
              />
              {/* Connection status indicator in input */}
              <div className="absolute inset-y-0 right-3 flex items-center">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              size="sm"
              className="h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Connection status message */}
          {!isConnected && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-red-500 dark:text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Connecting to chat server...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
