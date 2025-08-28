import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST() {
  try {
    console.log('🔧 Running chat migration...')
    
    // Create chat_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS "chat_sessions" (
        "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" varchar(255) NOT NULL,
        "user_name" varchar(255) NOT NULL,
        "user_email" varchar(255),
        "user_agent" text,
        "ip_address" varchar(45),
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "last_activity" timestamp NOT NULL DEFAULT now(),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `
    console.log('✅ Created chat_sessions table')
    
    // Create chat_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" varchar(255) NOT NULL,
        "sender_type" varchar(50) NOT NULL,
        "sender_id" varchar(255) NOT NULL,
        "sender_name" varchar(255) NOT NULL,
        "message" text NOT NULL,
        "message_type" varchar(50) NOT NULL DEFAULT 'text',
        "is_read" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `
    console.log('✅ Created chat_messages table')
    
    // Create chat_typing_indicators table
    await sql`
      CREATE TABLE IF NOT EXISTS "chat_typing_indicators" (
        "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" varchar(255) NOT NULL,
        "user_id" varchar(255) NOT NULL,
        "user_name" varchar(255) NOT NULL,
        "is_typing" boolean NOT NULL DEFAULT false,
        "last_typing" timestamp NOT NULL DEFAULT now()
      )
    `
    console.log('✅ Created chat_typing_indicators table')
    
    // Add foreign key constraints
    try {
      await sql`
        ALTER TABLE "chat_messages" 
        ADD CONSTRAINT "chat_messages_session_id_fkey" 
        FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
      `
      console.log('✅ Added foreign key constraint to chat_messages')
    } catch (e) {
      console.log('ℹ️ Foreign key constraint already exists or failed to add')
    }
    
    try {
      await sql`
        ALTER TABLE "chat_typing_indicators" 
        ADD CONSTRAINT "chat_typing_indicators_session_id_fkey" 
        FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
      `
      console.log('✅ Added foreign key constraint to chat_typing_indicators')
    } catch (e) {
      console.log('ℹ️ Foreign key constraint already exists or failed to add')
    }
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "chat_session_user_id_idx" ON "chat_sessions"("user_id")`
    await sql`CREATE INDEX IF NOT EXISTS "chat_session_status_idx" ON "chat_sessions"("status")`
    await sql`CREATE INDEX IF NOT EXISTS "chat_message_session_id_idx" ON "chat_messages"("session_id")`
    await sql`CREATE INDEX IF NOT EXISTS "chat_message_sender_type_idx" ON "chat_messages"("sender_type")`
    await sql`CREATE INDEX IF NOT EXISTS "chat_message_created_at_idx" ON "chat_messages"("created_at")`
    await sql`CREATE INDEX IF NOT EXISTS "chat_typing_session_id_idx" ON "chat_typing_indicators"("session_id")`
    await sql`CREATE INDEX IF NOT EXISTS "chat_typing_user_id_idx" ON "chat_typing_indicators"("user_id")`
    
    console.log('✅ Created all indexes')
    console.log('✅ Chat migration completed successfully')
    
    return NextResponse.json({ 
      success: true,
      message: 'Chat migration completed successfully'
    })
    
  } catch (error: any) {
    console.error('❌ Error running chat migration:', error)
    return NextResponse.json({ 
      error: 'Failed to run chat migration', 
      details: error.message
    }, { status: 500 })
  }
}

