import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function POST() {
  try {
    console.log('🔧 Fixing database schema...')
    
    // Check current structure
    const current = await sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' AND column_name = 'title'
    `
    
    console.log('Current title field:', current.rows[0])
    
    if (current.rows[0]?.data_type === 'character varying' && 
        current.rows[0]?.character_maximum_length === 255) {
      
      console.log('🔄 Converting title field from varchar(255) to text...')
      
      // Convert the column type
      await sql`
        ALTER TABLE "blog_posts" 
        ALTER COLUMN "title" TYPE text USING "title"::text
      `
      
      console.log('✅ Title field converted to text!')
      
      // Verify the change
      const newStructure = await sql`
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'title'
      `
      
      console.log('New title field structure:', newStructure.rows[0])
      
      return NextResponse.json({ 
        success: true, 
        message: 'Title field successfully converted to text',
        oldStructure: current.rows[0],
        newStructure: newStructure.rows[0]
      })
      
    } else {
      console.log('✅ Title field is already text type')
      return NextResponse.json({ 
        success: true, 
        message: 'No changes needed - title field is already text type',
        currentStructure: current.rows[0]
      })
    }
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = (error as any)?.code || 'UNKNOWN'
    
    return NextResponse.json({ 
      error: 'Failed to fix database schema', 
      details: errorMessage,
      code: errorCode
    }, { status: 500 })
  }
}

