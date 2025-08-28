const { sql } = require('@vercel/postgres')

async function testBlogCreation() {
  try {
    console.log('Testing blog creation with long title...')
    
    // Test data with a long title
    const testBlog = {
      id: 'test-' + Date.now(),
      title: 'This is a very long blog post title that should test if the varchar(255) limit is still causing issues. It needs to be longer than 255 characters to properly test the database schema changes we made. This title is intentionally long to ensure that the text field can handle substantial content without hitting any character limits.',
      slug: 'test-long-title-' + Date.now(),
      content: 'This is the content of the test blog post. It should work now that we fixed the title field.',
      excerpt: 'A test excerpt for the blog post.',
      authorId: 'test-author-id',
      featuredImage: 'https://example.com/test-image.jpg',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Title length:', testBlog.title.length, 'characters')
    
    // Insert the test blog post
    const result = await sql`
      INSERT INTO "blog_posts" (
        "id", "title", "slug", "content", "excerpt", 
        "author_id", "featured_image", "status", "created_at", "updated_at"
      ) VALUES (
        ${testBlog.id}, ${testBlog.title}, ${testBlog.slug}, ${testBlog.content}, ${testBlog.excerpt},
        ${testBlog.authorId}, ${testBlog.featuredImage}, ${testBlog.status}, ${testBlog.createdAt}, ${testBlog.updatedAt}
      )
      RETURNING "id", "title"
    `
    
    console.log('✅ Blog post created successfully!')
    console.log('Created blog:', result.rows[0])
    
    // Clean up - delete the test post
    await sql`DELETE FROM "blog_posts" WHERE "id" = ${testBlog.id}`
    console.log('🧹 Test blog post cleaned up')
    
  } catch (error) {
    console.error('❌ Error creating test blog:', error)
    
    if (error.message.includes('varchar(255)')) {
      console.log('\n💡 The varchar(255) error is still present. We need to fix the database table structure.')
    }
  }
}

testBlogCreation()
