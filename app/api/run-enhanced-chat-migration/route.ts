import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting enhanced chat migration...')

    // Add last_seen column
    await sql`
      ALTER TABLE chat_sessions 
      ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP
    `
    console.log('✅ Added last_seen column')

    // Add is_online column
    await sql`
      ALTER TABLE chat_sessions 
      ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE NOT NULL
    `
    console.log('✅ Added is_online column')

    // Create index for online status
    await sql`
      CREATE INDEX IF NOT EXISTS chat_session_is_online_idx 
      ON chat_sessions(is_online)
    `
    console.log('✅ Created is_online index')

    // Update existing sessions
    await sql`
      UPDATE chat_sessions 
      SET is_online = CASE 
        WHEN status = 'active' THEN TRUE 
        ELSE FALSE 
      END,
      last_seen = last_activity
      WHERE last_seen IS NULL
    `
    console.log('✅ Updated existing sessions')

    return NextResponse.json({
      success: true,
      message: 'Enhanced chat migration completed successfully'
    })

  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json(
      { success: false, error: 'Migration failed' },
      { status: 500 }
    )
  }
}

