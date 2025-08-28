const { Pool } = require('pg')
require('dotenv').config()

async function checkBlogs() {
  try {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    })

    const result = await pool.query('SELECT title, slug, status, created_at FROM blog_posts ORDER BY created_at DESC')
    
    console.log('📊 Current blog posts:')
    console.log('='.repeat(50))
    
    if (result.rows.length === 0) {
      console.log('❌ No blog posts found')
    } else {
      result.rows.forEach((post, i) => {
        console.log(`${i+1}. ${post.title}`)
        console.log(`   Status: ${post.status}`)
        console.log(`   Slug: ${post.slug}`)
        console.log(`   Created: ${post.created_at}`)
        console.log('')
      })
    }

    // Count by status
    const publishedCount = await pool.query('SELECT COUNT(*) FROM blog_posts WHERE status = $1', ['published'])
    const draftCount = await pool.query('SELECT COUNT(*) FROM blog_posts WHERE status = $1', ['draft'])
    
    console.log('📈 Summary:')
    console.log(`   Published: ${publishedCount.rows[0].count}`)
    console.log(`   Drafts: ${draftCount.rows[0].count}`)
    console.log(`   Total: ${result.rows.length}`)

    await pool.end()

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkBlogs()

