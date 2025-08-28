import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import db from '../db/drizzle'
import { chatSessions, chatMessages, chatTypingIndicators } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export interface ChatMessage {
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

export interface ChatSession {
  id: string
  userId: string
  userName: string
  userEmail?: string
  status: string
  lastActivity: Date
  createdAt: Date
}

export interface TypingIndicator {
  sessionId: string
  userId: string
  userName: string
  isTyping: boolean
}

class WebSocketServer {
  private io: SocketIOServer | null = null
  private sessions = new Map<string, string>() // sessionId -> socketId
  private adminSessions = new Map<string, string>() // adminId -> socketId

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://nitesh-handicraft.vercel.app",
          "https://*.vercel.app",
          process.env.NEXTAUTH_URL
        ].filter((origin): origin is string => Boolean(origin)),
        methods: ["GET", "POST"],
        credentials: true
      }
    })

    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`)

      // Handle user joining chat session
      socket.on('join-session', async (data: { sessionId: string; userId: string; userName: string }) => {
        const { sessionId, userId, userName } = data
        
        // Store session mapping
        this.sessions.set(sessionId, socket.id)
        socket.join(sessionId)
        
        // Update last activity
        await db.update(chatSessions)
          .set({ lastActivity: new Date() })
          .where(eq(chatSessions.id, sessionId))
        
        console.log(`👤 User ${userName} joined session ${sessionId}`)
        
        // Notify admin about new user
        this.io?.to('admin-room').emit('user-joined', { sessionId, userId, userName })
      })

      // Handle admin joining
      socket.on('admin-join', (adminId: string) => {
        this.adminSessions.set(adminId, socket.id)
        socket.join('admin-room')
        console.log(`👨‍💼 Admin ${adminId} joined admin room`)
      })

      // Handle user message
      socket.on('user-message', async (data: { sessionId: string; userId: string; userName: string; message: string }) => {
        const { sessionId, userId, userName, message } = data
        
        try {
          // Save message to database
          const [newMessage] = await db.insert(chatMessages).values({
            sessionId,
            senderType: 'user',
            senderId: userId,
            senderName: userName,
            message,
            messageType: 'text',
            isRead: false
          }).returning()

          // Update session last activity
          await db.update(chatSessions)
            .set({ lastActivity: new Date() })
            .where(eq(chatSessions.id, sessionId))

          // Broadcast to admin room
          this.io?.to('admin-room').emit('new-message', {
            ...newMessage,
            sessionId,
            senderType: 'user'
          })

          // Send confirmation to user
          socket.emit('message-sent', { success: true, messageId: newMessage.id })
          
          console.log(`💬 User message saved: ${message.substring(0, 50)}...`)
        } catch (error) {
          console.error('❌ Error saving user message:', error)
          socket.emit('message-sent', { success: false, error: 'Failed to send message' })
        }
      })

      // Handle admin message
      socket.on('admin-message', async (data: { sessionId: string; adminId: string; adminName: string; message: string }) => {
        const { sessionId, adminId, adminName, message } = data
        
        try {
          // Save message to database
          const [newMessage] = await db.insert(chatMessages).values({
            sessionId,
            senderType: 'admin',
            senderId: adminId,
            senderName: adminName,
            message,
            messageType: 'text',
            isRead: true
          }).returning()

          // Update session last activity
          await db.update(chatSessions)
            .set({ lastActivity: new Date() })
            .where(eq(chatSessions.id, sessionId))

          // Broadcast to specific session
          this.io?.to(sessionId).emit('new-message', {
            ...newMessage,
            sessionId,
            senderType: 'admin'
          })

          // Send confirmation to admin
          socket.emit('message-sent', { success: true, messageId: newMessage.id })
          
          console.log(`💬 Admin message sent to session ${sessionId}`)
        } catch (error) {
          console.error('❌ Error saving admin message:', error)
          socket.emit('message-sent', { success: false, error: 'Failed to send message' })
        }
      })

      // Handle typing indicators
      socket.on('typing-start', async (data: { sessionId: string; userId: string; userName: string }) => {
        const { sessionId, userId, userName } = data
        
        try {
          // Update typing indicator in database
          await db.insert(chatTypingIndicators).values({
            sessionId,
            userId,
            userName,
            isTyping: true
          }).onConflictDoUpdate({
            target: [chatTypingIndicators.sessionId, chatTypingIndicators.userId],
            set: { isTyping: true, lastTyping: new Date() }
          })

          // Broadcast typing indicator
          this.io?.to(sessionId).emit('typing-indicator', { userId, userName, isTyping: true })
        } catch (error) {
          console.error('❌ Error updating typing indicator:', error)
        }
      })

      socket.on('typing-stop', async (data: { sessionId: string; userId: string }) => {
        const { sessionId, userId } = data
        
        try {
          // Update typing indicator in database
          await db.update(chatTypingIndicators)
            .set({ isTyping: false, lastTyping: new Date() })
            .where(and(
              eq(chatTypingIndicators.sessionId, sessionId),
              eq(chatTypingIndicators.userId, userId)
            ))

          // Broadcast typing indicator
          this.io?.to(sessionId).emit('typing-indicator', { userId, isTyping: false })
        } catch (error) {
          console.error('❌ Error updating typing indicator:', error)
        }
      })

      // Handle session close
      socket.on('close-session', async (sessionId: string) => {
        try {
          // Update session status
          await db.update(chatSessions)
            .set({ status: 'closed', updatedAt: new Date() })
            .where(eq(chatSessions.id, sessionId))

          // Remove from sessions map
          this.sessions.delete(sessionId)
          
          // Notify admin
          this.io?.to('admin-room').emit('session-closed', { sessionId })
          
          console.log(`🔒 Session ${sessionId} closed`)
        } catch (error) {
          console.error('❌ Error closing session:', error)
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`)
        
        // Clean up sessions
        const sessionEntries = Array.from(this.sessions.entries())
        for (const [sessionId, socketId] of sessionEntries) {
          if (socketId === socket.id) {
            this.sessions.delete(sessionId)
            break
          }
        }
        
        const adminEntries = Array.from(this.adminSessions.entries())
        for (const [adminId, socketId] of adminEntries) {
          if (socketId === socket.id) {
            this.adminSessions.delete(adminId)
            break
          }
        }
      })
    })

    console.log('🚀 WebSocket server initialized')
  }

  getIO(): SocketIOServer | null {
    return this.io
  }
}

export const wsServer = new WebSocketServer()
