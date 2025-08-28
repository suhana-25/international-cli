// This script needs to be run in the Next.js environment
// Run it with: npm run dev and then in another terminal: node scripts/run-migration.js

const { sql } = require('@vercel/postgres')

async function runMigration() {
  try {
    console.log('Running migration to fix blog_posts title field...')
    
    // Check current table structure
    const currentStructure = await sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' AND column_name = 'title'
    `
    
    console.log('Current title field structure:', currentStructure.rows[0])
    
    if (currentStructure.rows[0]?.data_type === 'character varying' && 
        currentStructure.rows[0]?.character_maximum_length === 255) {
      
      console.log('Updating title field from varchar(255) to text...')
      
      // Run the migration
      await sql`
        ALTER TABLE "blog_posts" ALTER COLUMN "title" TYPE text
      `
      
      console.log('✅ Migration completed successfully!')
      
      // Verify the change
      const newStructure = await sql`
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'title'
      `
      
      console.log('New title field structure:', newStructure.rows[0])
      
    } else {
      console.log('✅ Title field is already text type, no migration needed')
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error)
  }
}

runMigration()
