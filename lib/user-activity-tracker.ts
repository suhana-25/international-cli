'use client'

class UserActivityTracker {
  private heartbeatInterval: NodeJS.Timeout | null = null
  private lastActivity: number = Date.now()
  private isActive: boolean = true
  private socket: any = null
  private sessionId: string | null = null
  private userId: string | null = null
  private userName: string | null = null

  constructor() {
    this.setupActivityListeners()
  }

  private setupActivityListeners() {
    // Track user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), { passive: true })
    })

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.setInactive()
      } else {
        this.setActive()
      }
    })

    // Track window focus/blur
    window.addEventListener('focus', () => this.setActive())
    window.addEventListener('blur', () => this.setInactive())

    // Track beforeunload (tab close)
    window.addEventListener('beforeunload', () => this.setInactive())
  }

  private updateActivity() {
    this.lastActivity = Date.now()
    if (!this.isActive) {
      this.setActive()
    }
  }

  private setActive() {
    if (!this.isActive) {
      this.isActive = true
      this.sendStatusUpdate('active')
      console.log('🟢 User became active')
    }
  }

  private setInactive() {
    if (this.isActive) {
      this.isActive = false
      this.sendStatusUpdate('inactive')
      console.log('🔴 User became inactive')
    }
  }

  private sendStatusUpdate(status: 'active' | 'inactive') {
    if (this.socket && this.sessionId) {
      this.socket.emit('user-status-update', {
        sessionId: this.sessionId,
        userId: this.userId,
        userName: this.userName,
        status: status,
        timestamp: new Date()
      })
    }
  }

  public startHeartbeat(socket: any, sessionId: string, userId: string, userName: string) {
    this.socket = socket
    this.sessionId = sessionId
    this.userId = userId
    this.userName = userName

    // Send initial active status
    this.sendStatusUpdate('active')

    // Start heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      if (this.isActive) {
        this.sendStatusUpdate('active')
      }
    }, 30000)

    console.log('💓 Heartbeat started for user:', userName)
  }

  public stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    // Send final inactive status
    this.sendStatusUpdate('inactive')
    
    console.log('💓 Heartbeat stopped')
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastActivity: this.lastActivity,
      idleTime: Date.now() - this.lastActivity
    }
  }

  public isIdle(thresholdMs: number = 60000) { // Default 1 minute
    return Date.now() - this.lastActivity > thresholdMs
  }
}

export default UserActivityTracker
