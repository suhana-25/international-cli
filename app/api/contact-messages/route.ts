import { NextRequest, NextResponse } from 'next/server'
import db from '@/db/drizzle'
import { contactMessages } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!data.email || !data.email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!data.subject || !data.subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject is required' },
        { status: 400 }
      )
    }

    if (!data.message || !data.message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const newMessage = await db.insert(contactMessages).values({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: 'unread',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    console.log('📧 New contact message received:', {
      id: newMessage[0].id,
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
    })

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
      data: {
        id: newMessage[0].id,
        createdAt: newMessage[0].createdAt
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating contact message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send message. Please try again.'
    }, { status: 500 })
  }
}

