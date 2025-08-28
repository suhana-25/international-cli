'use server'

import db from '../../db/drizzle'
import { chatSessions, chatMessages, chatTypingIndicators } from '../../db/schema'
import { eq, and, desc, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface CreateChatSessionData {
  userId: string
  userName: string
  userEmail?: string
  userAgent?: string
  ipAddress?: string
}

export interface SendMessageData {
  sessionId: string
  senderType: 'user' | 'admin'
  senderId: string
  senderName: string
  message: string
  messageType?: string
}

export async function createChatSession(data: CreateChatSessionData) {
  try {
    const [session] = await db.insert(chatSessions).values({
      ...data,
      status: 'active',
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    revalidatePath('/admin/chat')
    return { success: true, data: session }
  } catch (error) {
    console.error('Error creating chat session:', error)
    return { success: false, error: 'Failed to create chat session' }
  }
}

export async function getChatSession(sessionId: string) {
  try {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId))
    return { success: true, data: session }
  } catch (error) {
    console.error('Error getting chat session:', error)
    return { success: false, error: 'Failed to get chat session' }
  }
}

export async function getChatMessages(sessionId: string) {
  try {
    const messages = await db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt))
    
    return { success: true, data: messages }
  } catch (error) {
    console.error('Error getting chat messages:', error)
    return { success: false, error: 'Failed to get chat messages' }
  }
}

export async function sendMessage(data: SendMessageData) {
  try {
    const [message] = await db.insert(chatMessages).values({
      ...data,
      messageType: data.messageType || 'text',
      isRead: data.senderType === 'admin',
      createdAt: new Date(),
    }).returning()

    // Update session last activity
    await db.update(chatSessions)
      .set({ lastActivity: new Date(), updatedAt: new Date() })
      .where(eq(chatSessions.id, data.sessionId))

    revalidatePath('/admin/chat')
    return { success: true, data: message }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'Failed to send message' }
  }
}

export async function getAllChatSessions() {
  try {
    const sessions = await db.select({
      id: chatSessions.id,
      userId: chatSessions.userId,
      userName: chatSessions.userName,
      userEmail: chatSessions.userEmail,
      status: chatSessions.status,
      lastActivity: chatSessions.lastActivity,
      createdAt: chatSessions.createdAt,
      updatedAt: chatSessions.updatedAt,
      // Handle optional fields gracefully
      lastSeen: chatSessions.lastSeen || chatSessions.lastActivity,
      isOnline: chatSessions.isOnline || false
    }).from(chatSessions).orderBy(desc(chatSessions.lastActivity))
    
    return { success: true, data: sessions }
  } catch (error) {
    console.error('Error getting chat sessions:', error)
    return { success: false, error: 'Failed to get chat sessions' }
  }
}

export async function getActiveChatSessions() {
  try {
    const sessions = await db.select().from(chatSessions)
      .where(eq(chatSessions.status, 'active'))
      .orderBy(desc(chatSessions.lastActivity))
    
    return { success: true, data: sessions }
  } catch (error) {
    console.error('Error getting active chat sessions:', error)
    return { success: false, error: 'Failed to get active chat sessions' }
  }
}

export async function closeChatSession(sessionId: string) {
  try {
    await db.update(chatSessions)
      .set({ status: 'closed', updatedAt: new Date() })
      .where(eq(chatSessions.id, sessionId))

    revalidatePath('/admin/chat')
    return { success: true }
  } catch (error) {
    console.error('Error closing chat session:', error)
    return { success: false, error: 'Failed to close chat session' }
  }
}

export async function markMessagesAsRead(sessionId: string) {
  try {
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(and(
        eq(chatMessages.sessionId, sessionId),
        eq(chatMessages.senderType, 'user')
      ))

    return { success: true }
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return { success: false, error: 'Failed to mark messages as read' }
  }
}

export async function getUnreadMessageCount(sessionId: string) {
  try {
    const messages = await db.select().from(chatMessages)
      .where(and(
        eq(chatMessages.sessionId, sessionId),
        eq(chatMessages.senderType, 'user'),
        eq(chatMessages.isRead, false)
      ))

    const count = messages.length
    return { success: true, data: count }
  } catch (error) {
    console.error('Error getting unread message count:', error)
    return { success: false, error: 'Failed to get unread message count' }
  }
}

export async function updateTypingIndicator(sessionId: string, userId: string, userName: string, isTyping: boolean) {
  try {
    if (isTyping) {
      // First try to update existing record
      const updated = await db.update(chatTypingIndicators)
        .set({ isTyping: true, lastTyping: new Date() })
        .where(and(
          eq(chatTypingIndicators.sessionId, sessionId),
          eq(chatTypingIndicators.userId, userId)
        ))
        .returning()
      
      // If no record was updated, insert new one
      if (updated.length === 0) {
        await db.insert(chatTypingIndicators).values({
          sessionId,
          userId,
          userName,
          isTyping: true,
          lastTyping: new Date(),
        })
      }
    } else {
      await db.update(chatTypingIndicators)
        .set({ isTyping: false, lastTyping: new Date() })
        .where(and(
          eq(chatTypingIndicators.sessionId, sessionId),
          eq(chatTypingIndicators.userId, userId)
        ))
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating typing indicator:', error)
    return { success: false, error: 'Failed to update typing indicator' }
  }
}
