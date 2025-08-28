'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDbClient() {
  const [dbStatus, setDbStatus] = useState<string>('')
  const [usersStatus, setUsersStatus] = useState<string>('')

  const testDatabase = async () => {
    try {
      setDbStatus('Testing...')
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setDbStatus(data.success ? '✅ Database working' : `❌ Database error: ${data.message}`)
    } catch (error) {
      setDbStatus(`❌ Database error: ${error}`)
    }
  }

  const testUsers = async () => {
    try {
      setUsersStatus('Testing...')
      const response = await fetch('/api/test-users')
      const data = await response.json()
      setUsersStatus(data.success ? `✅ Users found: ${data.count}` : `❌ Users error: ${data.message}`)
    } catch (error) {
      setUsersStatus(`❌ Users error: ${error}`)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <Button onClick={testDatabase} className="w-full mb-2">
            Test Database Connection
          </Button>
          <p className="text-sm">{dbStatus}</p>
        </div>
        
        <div>
          <Button onClick={testUsers} className="w-full mb-2">
            Test Users Table
          </Button>
          <p className="text-sm">{usersStatus}</p>
        </div>
      </div>
    </div>
  )
}
