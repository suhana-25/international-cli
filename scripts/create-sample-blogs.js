const { Pool } = require('pg')
require('dotenv').config()

async function createSampleBlogs() {
  try {
    console.log('🔍 Creating sample blog posts...')
    
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    })

    // Get admin user
    const usersResult = await pool.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin'])
    if (usersResult.rows.length === 0) {
      console.log('❌ No admin user found!')
      await pool.end()
      return
    }

    const adminUserId = usersResult.rows[0].id
    console.log('👤 Using admin user ID:', adminUserId)

    // Sample blog posts
    const samplePosts = [
      {
        title: 'Welcome to Nitesh Handicrafts',
        slug: 'welcome-to-nitesh-handicrafts',
        content: `Welcome to Nitesh Handicrafts! We are passionate about bringing you the finest traditional handicrafts from around the world.

Our journey began with a simple mission: to preserve and promote the beautiful art of handmade crafts while supporting local artisans and their communities.

What We Offer:
• Traditional pottery and ceramics
• Handwoven textiles and rugs
• Wooden carvings and furniture
• Metalwork and jewelry
• And much more!

Each piece in our collection tells a story - a story of tradition, craftsmanship, and cultural heritage. We believe that every handmade item carries with it the love and dedication of the artisan who created it.

Stay tuned for more updates, behind-the-scenes looks at our artisans, and special features on different crafting techniques.`,
        excerpt: 'Discover the story behind Nitesh Handicrafts and our mission to preserve traditional craftsmanship.',
        status: 'published'
      },
      {
        title: 'The Art of Traditional Pottery',
        slug: 'art-of-traditional-pottery',
        content: `Traditional pottery is one of the oldest forms of human artistic expression, dating back thousands of years. This ancient craft combines functionality with beauty, creating objects that are both practical and aesthetically pleasing.

The Process:
1. Clay Preparation: Natural clay is carefully selected and prepared
2. Shaping: Using traditional techniques like wheel throwing or hand building
3. Drying: Natural drying process to remove moisture
4. Firing: High-temperature firing in traditional kilns
5. Glazing: Application of natural glazes and decorative elements

Our pottery artisans use techniques passed down through generations, ensuring that each piece maintains the authentic character of traditional craftsmanship.

The beauty of handmade pottery lies in its uniqueness - no two pieces are exactly alike, making each item truly special.`,
        excerpt: 'Explore the ancient art of traditional pottery and the techniques used by our skilled artisans.',
        status: 'published'
      },
      {
        title: 'Handwoven Textiles: A Labor of Love',
        slug: 'handwoven-textiles-labor-of-love',
        content: `Handwoven textiles represent the pinnacle of textile craftsmanship. Each piece is created with painstaking attention to detail, using techniques that have been perfected over centuries.

The Weaving Process:
• Yarn Selection: Carefully chosen natural fibers
• Warp Preparation: Setting up the vertical threads
• Weft Insertion: Horizontal threads woven through the warp
• Pattern Creation: Complex designs created row by row
• Finishing: Washing, pressing, and quality checks

Our weavers work on traditional looms, some of which have been in their families for generations. The patterns they create often tell stories of their culture and heritage.

The result is textiles that are not only beautiful but also incredibly durable and unique. Each piece carries the mark of the individual weaver, making it a true work of art.`,
        excerpt: 'Learn about the intricate process of creating handwoven textiles and the stories they tell.',
        status: 'published'
      }
    ]

    // Create each blog post
    for (const post of samplePosts) {
      const insertResult = await pool.query(`
        INSERT INTO blog_posts (title, slug, content, excerpt, author_id, featured_image, status, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, title, status
      `, [
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        adminUserId,
        '', // No featured image for now
        post.status,
        post.status === 'published' ? new Date() : null,
        new Date(),
        new Date()
      ])

      console.log(`✅ Created: ${insertResult.rows[0].title} (${insertResult.rows[0].status})`)
    }

    // Check total published posts
    const publishedCount = await pool.query('SELECT COUNT(*) FROM blog_posts WHERE status = $1', ['published'])
    console.log(`📊 Total published posts: ${publishedCount.rows[0].count}`)

    await pool.end()
    console.log('🎉 Sample blog posts created successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createSampleBlogs()

