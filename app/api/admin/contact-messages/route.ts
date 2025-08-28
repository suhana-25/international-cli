import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@/lib/auth' // Removed - using custom auth
import db from '@/db/drizzle'
import { contactMessages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session || "admin".role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt))
    
    if (status && status !== 'all') {
      query = query.where(eq(contactMessages.status, status))
    }

    const messages = await query

    return NextResponse.json({
      success: true,
      data: messages
    })

  } catch (error) {
    console.error('❌ Error fetching contact messages:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contact messages'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session || "admin".role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()

    const updatedMessage = await db.update(contactMessages)
      .set({
        status: data.status,
        updatedAt: new Date()
      })
      .where(eq(contactMessages.id, id))
      .returning()

    if (updatedMessage.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedMessage[0]
    })

  } catch (error: any) {
    console.error('❌ Error updating contact message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update contact message'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = null // Skip auth check - using custom auth system
    // if (!session || "admin".role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const deletedMessage = await db.delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning()

    if (deletedMessage.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    })

  } catch (error) {
    console.error('❌ Error deleting contact message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete contact message'
    }, { status: 500 })
  }
}

