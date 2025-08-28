const { Pool } = require('pg');

// Database connection - update these values based on your .env file
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://username:password@localhost:5432/database',
});

async function publishAllBlogs() {
  console.log('Publishing all draft blogs...\n');

  try {
    // Connect to database
    const client = await pool.connect();
    console.log('Connected to database');

    // Get all draft blogs
    const draftBlogsQuery = `
      SELECT id, title, slug, status 
      FROM blog_posts 
      WHERE status = 'draft'
      ORDER BY created_at DESC
    `;
    
    const draftBlogsResult = await client.query(draftBlogsQuery);
    const draftBlogs = draftBlogsResult.rows;
    
    console.log(`Found ${draftBlogs.length} draft blogs:`);
    draftBlogs.forEach(blog => {
      console.log(`- ${blog.title} (${blog.slug}) - Status: ${blog.status}`);
    });

    if (draftBlogs.length === 0) {
      console.log('No draft blogs found. All blogs are already published.');
      return;
    }

    // Publish all draft blogs
    const updateQuery = `
      UPDATE blog_posts 
      SET status = 'published', 
          published_at = NOW(), 
          updated_at = NOW()
      WHERE status = 'draft'
    `;
    
    const updateResult = await client.query(updateQuery);
    console.log(`\nUpdated ${updateResult.rowCount} blogs to published status`);

    // Verify the update
    const verifyQuery = `
      SELECT id, title, slug, status, published_at
      FROM blog_posts 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    
    const verifyResult = await client.query(verifyQuery);
    console.log(`\nTotal published blogs: ${verifyResult.rowCount}`);
    
    verifyResult.rows.forEach(blog => {
      console.log(`- ${blog.title} (${blog.slug}) - Published: ${blog.published_at}`);
    });

    client.release();
    console.log('\n✅ All blogs have been published successfully!');
    console.log('They should now be visible on the public blog page (/blogs)');

  } catch (error) {
    console.error('Error publishing blogs:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
publishAllBlogs();
