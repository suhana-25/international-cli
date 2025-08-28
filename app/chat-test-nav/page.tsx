'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Users, ArrowRight } from 'lucide-react'

export default function ChatTestNavPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">🚀 Chat System Test Hub</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Chat Test */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <span>User Chat Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Test the user-side chat widget. Open this page and click the blue chat button in the bottom-right corner.
              </p>
              <Link href="/test-chat">
                <Button className="w-full">
                  Open User Chat Test
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Chat Test */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-green-600" />
                <span>Admin Chat Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Test the admin-side chat panel. Send messages to users and see real-time communication.
              </p>
              <Link href="/test-admin-chat">
                <Button className="w-full" variant="outline">
                  Open Admin Chat Test
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🧪 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Step 1: Test User Chat</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Open the User Chat Test page</li>
                  <li>Click the blue chat button in the bottom-right corner</li>
                  <li>Enter your name when prompted</li>
                  <li>Try sending a message</li>
                  <li>Check browser console for connection status</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Step 2: Test Admin Chat</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Open the Admin Chat Test page in another tab</li>
                  <li>Wait for the WebSocket connection (green dot)</li>
                  <li>Go back to User Chat Test and start chatting</li>
                  <li>Your username should appear in the Admin panel</li>
                  <li>Select your username and send a message</li>
                  <li>Check if the message appears in your user chat</li>
                </ol>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Tips</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Keep both pages open in separate tabs</li>
                  <li>• Check browser console for WebSocket connection status</li>
                  <li>• If connection fails, refresh the page</li>
                  <li>• Make sure the server is running (npm run dev)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
