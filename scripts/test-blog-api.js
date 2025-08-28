const fetch = require('node-fetch');

async function testBlogAPI() {
  console.log('Testing Blog API...\n');

  try {
    // Test 1: Get all blogs (public API)
    console.log('1. Testing Public Blog API (/api/blog):');
    const publicResponse = await fetch('http://localhost:3000/api/blog');
    const publicData = await publicResponse.json();
    console.log('Status:', publicResponse.status);
    console.log('Data:', JSON.stringify(publicData, null, 2));
    console.log('Number of blogs:', Array.isArray(publicData) ? publicData.length : 'Not an array');
    console.log('');

    // Test 2: Get admin blogs (admin API)
    console.log('2. Testing Admin Blog API (/api/admin/blog):');
    console.log('Note: This requires admin authentication');
    console.log('');

    // Test 3: Check if any blogs exist in the response
    if (Array.isArray(publicData) && publicData.length > 0) {
      console.log('3. Blog Details:');
      publicData.forEach((blog, index) => {
        console.log(`Blog ${index + 1}:`);
        console.log(`  ID: ${blog.id}`);
        console.log(`  Title: ${blog.title}`);
        console.log(`  Slug: ${blog.slug}`);
        console.log(`  Status: ${blog.status}`);
        console.log(`  Published: ${blog.publishedAt || 'Not published'}`);
        console.log(`  Created: ${blog.createdAt}`);
        console.log('');
      });

      // Test 4: Test individual blog by slug
      const firstBlog = publicData[0];
      if (firstBlog && firstBlog.slug) {
        console.log('4. Testing Individual Blog API:');
        console.log(`Testing slug: ${firstBlog.slug}`);
        const individualResponse = await fetch(`http://localhost:3000/api/blog?slug=${firstBlog.slug}`);
        const individualData = await individualResponse.json();
        console.log('Status:', individualResponse.status);
        console.log('Data:', JSON.stringify(individualData, null, 2));
      }
    } else {
      console.log('3. No blogs found in public API');
      console.log('This could mean:');
      console.log('- No blogs exist in the database');
      console.log('- All blogs are in draft status');
      console.log('- There\'s an issue with the database query');
    }

  } catch (error) {
    console.error('Error testing blog API:', error);
  }
}

// Run the test
testBlogAPI();
