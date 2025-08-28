const { sql } = require('@vercel/postgres')

async function checkBlogTableStructure() {
  try {
    console.log('Checking blog_posts table structure...')
    
    // Get table structure
    const result = await sql`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts'
      ORDER BY ordinal_position
    `
    
    console.log('Blog posts table structure:')
    console.table(result.rows)
    
    // Check if there are any varchar(255) constraints
    const varcharCheck = await sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      AND data_type = 'character varying' 
      AND character_maximum_length = 255
    `
    
    if (varcharCheck.rows.length > 0) {
      console.log('\n⚠️  Found varchar(255) fields that might be too restrictive:')
      console.table(varcharCheck.rows)
    }
    
  } catch (error) {
    console.error('Error checking table structure:', error)
  }
}

checkBlogTableStructure()
