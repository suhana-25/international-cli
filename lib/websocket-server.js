const { Server: SocketIOServer } = require('socket.io')

class WebSocketServer {
  constructor() {
    this.io = null
    this.userConnections = new Map() // socketId -> userData
    this.adminSessions = new Map() // adminId -> socketId
    this.activeUsers = new Map() // userId -> userData (for real-time status)
    this.userSessions = new Map() // userId -> socketId (for direct messaging)
  }

  initialize(server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://nitesh-handicraft.vercel.app",
          "https://*.vercel.app",
          process.env.NEXTAUTH_URL
        ].filter(Boolean),
        methods: ["GET", "POST"],
        credentials: true
      }
    })

    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`)

      // Handle user join session
      socket.on('join-session', async (data) => {
        console.log('🔍 Join session event received:', data)
        const { sessionId, userId, userName, userEmail } = data
        
        if (!sessionId || !userId || !userName) {
          console.error('❌ Missing required data for join-session:', { sessionId, userId, userName })
          return
        }
        
        // Determine if this is a signed-in user or guest
        const isSignedInUser = userName && !userName.startsWith('Guest_') && userName.length > 5
        const hasRealEmail = userEmail && !userEmail.includes('guest_') && userEmail.includes('@')
        
        // Use provided data or generate guest data
        const finalUserName = isSignedInUser ? userName : `Guest_${Math.random().toString(36).substr(2, 5)}`
        const finalUserEmail = (isSignedInUser && hasRealEmail) ? userEmail : `guest_${Math.random().toString(36).substr(2, 5)}@example.com`
        
        // Track user connection with online status
        const userData = {
          sessionId,
          userId,
          userName: finalUserName,
          userEmail: finalUserEmail,
          isOnline: true,
          lastSeen: new Date(),
          socketId: socket.id,
          joinedAt: new Date(),
          lastHeartbeat: new Date()
        }
        
        // Store user data
        this.userConnections.set(socket.id, userData)
        this.activeUsers.set(userId, userData)
        this.userSessions.set(userId, socket.id)
        
        // Join the session room
        socket.join(sessionId)
        
        console.log(`👤 User ${finalUserName} (${userId}) joined session ${sessionId}`)
        console.log(`📊 User type: ${isSignedInUser ? 'Signed-in' : 'Guest'}`)
        console.log(`📊 User email: ${finalUserEmail}`)
        console.log(`📊 Current active users: ${this.activeUsers.size}`)
        console.log(`🔗 User connections: ${this.userConnections.size}`)
        console.log(`🔗 User sessions map:`, Array.from(this.userSessions.entries()))
        
        // Notify admin about new user
        this.io?.to('admin-room').emit('user-joined', userData)
        
        // Send current active users count to admin
        this.broadcastActiveUsers()
      })

      // Handle user heartbeat (keep-alive)
      socket.on('heartbeat', (data) => {
        const { userId } = data
        const userData = this.activeUsers.get(userId)
        
        if (userData) {
          userData.lastHeartbeat = new Date()
          userData.lastSeen = new Date()
          console.log(`💓 Heartbeat from ${userData.userName} (${userId})`)
        }
      })

      // Handle admin joining
      socket.on('admin-join', (adminId) => {
        this.adminSessions.set(adminId, socket.id)
        socket.join('admin-room')
        console.log(`👨‍💼 Admin ${adminId} joined admin room`)
        
        // Send current active users to admin
        this.broadcastActiveUsers()
      })

      // Handle user message
      socket.on('user-message', async (data) => {
        const { sessionId, userId, userName, message } = data
        
        console.log('📨 User message received:', { sessionId, userId, userName, message })
        
        try {
          // Create message object
          const newMessage = {
            id: Date.now().toString(),
            sessionId,
            senderType: 'user',
            senderId: userId,
            senderName: userName,
            message,
            messageType: 'text',
            isRead: false,
            createdAt: new Date()
          }

          // Broadcast to admin room
          this.io?.to('admin-room').emit('user-message', newMessage)
          
          console.log(`💬 User message from ${userName} sent to admin room`)
          
          // Send confirmation to user
          socket.emit('message-sent', { success: true, messageId: newMessage.id })
        } catch (error) {
          console.error('❌ Error handling user message:', error)
          socket.emit('message-sent', { success: false, error: 'Failed to send message' })
        }
      })

      // Handle admin message
      socket.on('admin-message', async (data) => {
        const { sessionId, adminId, adminName, message, targetUserId } = data
        
        console.log('📨 Admin message received:', { sessionId, adminId, adminName, message, targetUserId })
        
        try {
          // Create message object
          const newMessage = {
            id: Date.now().toString(),
            sessionId,
            senderType: 'admin',
            senderId: adminId,
            senderName: adminName,
            message,
            messageType: 'text',
            isRead: true,
            createdAt: new Date()
          }

          // Find the user's socket ID - try multiple methods
          let userSocketId = null
          
          // Method 1: Find by targetUserId if provided
          if (targetUserId) {
            userSocketId = this.userSessions.get(targetUserId)
            console.log(`🔍 Looking for user ${targetUserId}, found socket: ${userSocketId}`)
          }
          
          // Method 2: Find by sessionId in userConnections
          if (!userSocketId) {
            for (const [socketId, userData] of this.userConnections.entries()) {
              if (userData.sessionId === sessionId) {
                userSocketId = socketId
                console.log(`🔍 Found user by sessionId ${sessionId}: socket ${socketId}`)
                break
              }
            }
          }
          
          // Method 3: Find by userId in userConnections
          if (!userSocketId && targetUserId) {
            for (const [socketId, userData] of this.userConnections.entries()) {
              if (userData.userId === targetUserId) {
                userSocketId = socketId
                console.log(`🔍 Found user by userId ${targetUserId}: socket ${socketId}`)
                break
              }
            }
          }

          if (userSocketId) {
            // Send directly to the user
            this.io?.to(userSocketId).emit('admin-message', newMessage)
            console.log(`💬 Admin message sent to user ${targetUserId || sessionId} (socket: ${userSocketId}): ${message}`)
            
            // Send confirmation to admin
            socket.emit('message-sent', { success: true, messageId: newMessage.id })
          } else {
            console.log(`⚠️ User not found for session ${sessionId}`)
            console.log(`🔍 Available sessions:`, Array.from(this.userConnections.values()).map(u => ({ 
              sessionId: u.sessionId, 
              userId: u.userId, 
              userName: u.userName,
              socketId: u.socketId 
            })))
            console.log(`🔍 User sessions map:`, Array.from(this.userSessions.entries()))
            socket.emit('message-sent', { success: false, error: 'User not found for this session' })
          }
        } catch (error) {
          console.error('❌ Error handling admin message:', error)
          socket.emit('message-sent', { success: false, error: 'Failed to send message' })
        }
      })

      // Handle typing indicators
      socket.on('typing-start', async (data) => {
        const { sessionId, userId, userName, adminId, adminName } = data
        
        try {
          if (adminId) {
            // Admin is typing - send to user
            let userSocketId = null
            for (const [socketId, userData] of this.userConnections.entries()) {
              if (userData.sessionId === sessionId) {
                userSocketId = socketId
                break
              }
            }
            
            if (userSocketId) {
              this.io?.to(userSocketId).emit('typing-start', { 
                sessionId, 
                senderType: 'admin',
                adminName 
              })
            }
          } else {
            // User is typing - send to admin
            this.io?.to('admin-room').emit('typing-start', { 
              sessionId, 
              userId, 
              userName,
              senderType: 'user'
            })
          }
        } catch (error) {
          console.error('❌ Error handling typing start:', error)
        }
      })

      socket.on('typing-stop', async (data) => {
        const { sessionId, userId, adminId } = data
        
        try {
          if (adminId) {
            // Admin stopped typing - send to user
            let userSocketId = null
            for (const [socketId, userData] of this.userConnections.entries()) {
              if (userData.sessionId === sessionId) {
                userSocketId = socketId
                break
              }
            }
            
            if (userSocketId) {
              this.io?.to(userSocketId).emit('typing-stop', { 
                sessionId, 
                senderType: 'admin'
              })
            }
          } else {
            // User stopped typing - send to admin
            this.io?.to('admin-room').emit('typing-stop', { 
              sessionId, 
              userId,
              senderType: 'user'
            })
          }
        } catch (error) {
          console.error('❌ Error handling typing stop:', error)
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`)
        
        // Get user data before removing
        const userData = this.userConnections.get(socket.id)
        
        // Clean up admin sessions
        for (const [adminId, socketId] of this.adminSessions.entries()) {
          if (socketId === socket.id) {
            this.adminSessions.delete(adminId)
            break
          }
        }
        
        // Handle user disconnect
        if (userData) {
          console.log(`👋 User ${userData.userName} (${userData.userId}) disconnected`)
          
          // Remove from active users immediately
          this.activeUsers.delete(userData.userId)
          
          // Remove from user sessions
          this.userSessions.delete(userData.userId)
          
          // Remove from user connections
          this.userConnections.delete(socket.id)
          
          // Notify admin about user leaving
          this.io?.to('admin-room').emit('user-left', { 
            sessionId: userData.sessionId, 
            userId: userData.userId, 
            userName: userData.userName,
            userEmail: userData.userEmail,
            isOnline: false,
            lastSeen: new Date()
          })
          
          // Update active users count immediately
          this.broadcastActiveUsers()
        }
      })
    })

    console.log('🚀 WebSocket server initialized')
    
    // Start idle user checking every 30 seconds
    setInterval(() => {
      this.checkIdleUsers()
    }, 30000)
  }

  getIO() {
    return this.io
  }

  // Check for idle users (idle > 1 minute)
  checkIdleUsers() {
    const now = new Date()
    const idleThreshold = 60000 // 1 minute in milliseconds
    
    for (const [userId, userData] of this.activeUsers.entries()) {
      const timeSinceHeartbeat = now.getTime() - userData.lastHeartbeat.getTime()
      
      if (timeSinceHeartbeat > idleThreshold) {
        console.log(`😴 User ${userData.userName} (${userId}) marked as idle`)
        
        // Remove from active users
        this.activeUsers.delete(userId)
        
        // Notify admin
        this.io?.to('admin-room').emit('user-idle', {
          sessionId: userData.sessionId,
          userId: userData.userId,
          userName: userData.userName,
          userEmail: userData.userEmail,
          isOnline: false,
          lastSeen: now
        })
      }
    }
    
    // Always broadcast updated status
    this.broadcastActiveUsers()
  }

  broadcastActiveUsers() {
    if (!this.io) return
    
    // Get online users (only currently active)
    const onlineUsers = Array.from(this.activeUsers.values())
    
    // Get offline users (from connections but not in activeUsers)
    const offlineUsers = Array.from(this.userConnections.values())
      .filter(user => !this.activeUsers.has(user.userId))
    
    const status = {
      online: {
        count: onlineUsers.length,
        users: onlineUsers.map(user => ({
          sessionId: user.sessionId,
          userId: user.userId,
          userName: user.userName,
          userEmail: user.userEmail,
          isOnline: true,
          lastSeen: user.lastSeen,
          joinedAt: user.joinedAt,
          unreadCount: 0
        }))
      },
      offline: {
        count: offlineUsers.length,
        users: offlineUsers.map(user => ({
          sessionId: user.sessionId,
          userId: user.userId,
          userName: user.userName,
          userEmail: user.userEmail,
          isOnline: false,
          lastSeen: user.lastSeen,
          joinedAt: user.joinedAt,
          unreadCount: 0
        }))
      },
      total: {
        online: onlineUsers.length,
        offline: offlineUsers.length,
        all: onlineUsers.length + offlineUsers.length
      }
    }
    
    console.log('📤 Broadcasting active users status:', {
      onlineCount: onlineUsers.length,
      offlineCount: offlineUsers.length,
      onlineUsers: onlineUsers.map(u => ({ name: u.userName, id: u.userId, sessionId: u.sessionId })),
      offlineUsers: offlineUsers.map(u => ({ name: u.userName, id: u.userId, sessionId: u.sessionId }))
    })
    
    // Send to admin room
    this.io.to('admin-room').emit('active-users-update', status)
    
    console.log(`📊 Real-time Status - Online: ${onlineUsers.length}, Offline: ${offlineUsers.length}, Total: ${status.total.all}`)
  }
}

const wsServer = new WebSocketServer()
module.exports = { wsServer }
