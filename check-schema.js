const { Pool } = require('pg');
require('dotenv').config();

async function checkSchema() {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
  
  try {
    console.log('🔍 Checking blog_posts table schema...\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      ORDER BY ordinal_position
    `);
    
    console.log('Blog posts table columns:');
    result.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });
    
    console.log('\n📊 Current blog posts:');
    const posts = await pool.query('SELECT id, title, slug, status, published_at FROM blog_posts');
    posts.rows.forEach(post => {
      console.log(`  ${post.id}: "${post.title}" (${post.status}) - published: ${post.published_at || 'null'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkSchema();