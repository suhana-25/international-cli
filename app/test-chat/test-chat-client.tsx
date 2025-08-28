'use client'

import SimpleChatWidget from '@/components/shared/chat/simple-chat-widget'

export default function TestChatClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Chat Widget Test</h1>
      <p className="mb-4">This page tests the simplified chat widget.</p>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Look for the blue chat button in the bottom-right corner</li>
          <li>Click it to open the chat</li>
          <li>If you're not logged in, enter a guest name</li>
          <li>Try sending a message</li>
          <li>Check the browser console for any errors</li>
        </ol>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Debug Info:</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>WebSocket URL:</strong> {process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000'}</p>
        </div>
      </div>
        
      {/* Simple Chat Widget */}
      <SimpleChatWidget />
    </div>
  )
}
