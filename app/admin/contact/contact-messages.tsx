'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock,
  Loader2,
  Filter
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatDistance } from 'date-fns'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
  updatedAt: string
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [statusFilter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/contact-messages?status=${statusFilter}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMessages(result.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch contact messages',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      setUpdating(messageId)
      const response = await fetch(`/api/admin/contact-messages?id=${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, status: status as any } : msg
            )
          )
          toast({
            title: 'Success',
            description: 'Message status updated successfully'
          })
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      setUpdating(messageId)
      const response = await fetch(`/api/admin/contact-messages?id=${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId))
          toast({
            title: 'Success',
            description: 'Message deleted successfully'
          })
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setShowDialog(true)
    
    // Mark as read if it's unread
    if (message.status === 'unread') {
      updateMessageStatus(message.id, 'read')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive">Unread</Badge>
      case 'read':
        return <Badge variant="secondary">Read</Badge>
      case 'replied':
        return <Badge variant="default">Replied</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Mail className="w-4 h-4 text-red-500" />
      case 'read':
        return <Eye className="w-4 h-4 text-blue-500" />
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading contact messages...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Messages
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage customer inquiries and contact form submissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Contact Messages</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'No contact messages have been received yet.'
                  : `No ${statusFilter} messages found.`
                }
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id} className={message.status === 'unread' ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(message.status)}
                          {getStatusBadge(message.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDistance(new Date(message.createdAt), new Date(), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openMessage(message)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select 
                            value={message.status} 
                            onValueChange={(value) => updateMessageStatus(message.id, value)}
                            disabled={updating === message.id}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unread">Unread</SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                              <SelectItem value="replied">Replied</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                            disabled={updating === message.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            {updating === message.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Message from {selectedMessage?.name}
            </DialogTitle>
            <DialogDescription>
              Received {selectedMessage && formatDistance(new Date(selectedMessage.createdAt), new Date(), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedMessage.status)}
                  {getStatusBadge(selectedMessage.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`
                      updateMessageStatus(selectedMessage.id, 'replied')
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                  <Select 
                    value={selectedMessage.status} 
                    onValueChange={(value) => {
                      updateMessageStatus(selectedMessage.id, value)
                      setSelectedMessage({...selectedMessage, status: value as any})
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
