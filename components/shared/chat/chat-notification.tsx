'use client'

import React, { useEffect, useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatNotificationProps {
  message: string
  senderName: string
  onOpenChat: () => void
  onClose: () => void
}

export default function ChatNotification({ message, senderName, onOpenChat, onClose }: ChatNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 10000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-80">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                New Message from {senderName}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {message}
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  onOpenChat()
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                Open Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
