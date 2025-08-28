const fetch = require('node-fetch');

async function testAboutPage() {
  console.log('Testing About Page API...\n');

  try {
    // Test the public about API
    console.log('1. Testing Public About API (/api/about):');
    const response = await fetch('http://localhost:3000/api/about');
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ About API is working!');
      console.log('Available fields:');
      console.log('- Title:', data.title);
      console.log('- Subtitle:', data.subtitle);
      console.log('- Main Content:', data.mainContent ? 'Present' : 'Missing');
      console.log('- Mission:', data.mission ? 'Present' : 'Missing');
      console.log('- Vision:', data.vision ? 'Present' : 'Missing');
      console.log('- Values:', data.values ? 'Present' : 'Missing');
      console.log('- Company History:', data.companyHistory ? 'Present' : 'Missing');
      console.log('- Team Info:', data.teamInfo ? 'Present' : 'Missing');
    } else {
      console.log('\n❌ About API failed:', data.error);
    }

  } catch (error) {
    console.error('Error testing about page:', error);
  }
}

// Run the test
testAboutPage();
