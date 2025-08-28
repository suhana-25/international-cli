const { Pool } = require('pg')
require('dotenv').config()

async function testBlogCreation() {
  try {
    console.log('🔍 Testing blog creation...')
    
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    })

    // First, check if we have any users
    const usersResult = await pool.query('SELECT id, email, role FROM users LIMIT 1')
    console.log('👥 Users found:', usersResult.rows.length)
    
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found. Please create an admin user first.')
      await pool.end()
      return
    }

    const adminUser = usersResult.rows[0]
    console.log('👤 Using admin user:', adminUser.email, 'Role:', adminUser.role)

    // Check if blog_posts table exists
    const tableCheck = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'blog_posts'
    `)
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ blog_posts table not found!')
      await pool.end()
      return
    }

    console.log('✅ blog_posts table exists')

    // Create a test blog post
    const testPost = {
      title: 'Test Blog Post - Our Services',
      slug: 'test-blog-post-our-services',
      content: 'This is a test blog post about our services. We provide high-quality handicrafts and traditional items.',
      excerpt: 'A test blog post about our services and handicrafts.',
      author_id: adminUser.id,
      featured_image: '',
      status: 'published', // Make it published so it shows on client side
      published_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }

    const insertResult = await pool.query(`
      INSERT INTO blog_posts (title, slug, content, excerpt, author_id, featured_image, status, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      testPost.title,
      testPost.slug,
      testPost.content,
      testPost.excerpt,
      testPost.author_id,
      testPost.featured_image,
      testPost.status,
      testPost.published_at,
      testPost.created_at,
      testPost.updated_at
    ])

    console.log('✅ Test blog post created successfully!')
    console.log('📝 Post ID:', insertResult.rows[0].id)
    console.log('📝 Post Title:', insertResult.rows[0].title)
    console.log('📝 Post Status:', insertResult.rows[0].status)

    // Check if we can fetch it
    const fetchResult = await pool.query('SELECT * FROM blog_posts WHERE status = $1', ['published'])
    console.log('📊 Published posts found:', fetchResult.rows.length)

    await pool.end()

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

testBlogCreation()

