const { sql } = require('@vercel/postgres')

async function fixBlogTitleField() {
  try {
    console.log('Fixing blog_posts title field from varchar(255) to text...')
    
    // Alter the title column to text type
    await sql`
      ALTER TABLE "blog_posts" 
      ALTER COLUMN "title" TYPE text
    `
    
    console.log('✅ Successfully changed title field to text type')
    
    // Verify the change
    const result = await sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      AND column_name = 'title'
    `
    
    console.log('Verification - title field structure:')
    console.table(result.rows)
    
  } catch (error) {
    console.error('❌ Error fixing title field:', error)
  }
}

fixBlogTitleField()
