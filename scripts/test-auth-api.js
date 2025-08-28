const fetch = require('node-fetch');

console.log('🧪 Testing Authentication API...\n');

// Test 1: Test sign-in with test user
async function testSignIn() {
  console.log('📝 Test 1: Testing sign-in with test user...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    });

    const result = await response.json();
    console.log(`📡 Response Status: ${response.status}`);
    console.log(`📊 Response Data:`, result);
    
    if (result.success) {
      console.log('✅ Sign-in successful!');
      console.log(`👤 User: ${result.user.name} (${result.user.email})`);
      console.log(`🔑 Role: ${result.user.role}`);
    } else {
      console.log('❌ Sign-in failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing sign-in:', error.message);
  }
}

// Test 2: Test sign-up with new user
async function testSignUp() {
  console.log('\n📝 Test 2: Testing sign-up with new user...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123'
      })
    });

    const result = await response.json();
    console.log(`📡 Response Status: ${response.status}`);
    console.log(`📊 Response Data:`, result);
    
    if (result.success) {
      console.log('✅ Sign-up successful!');
      console.log(`👤 User: ${result.user.name} (${result.user.email})`);
    } else {
      console.log('❌ Sign-up failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing sign-up:', error.message);
  }
}

// Test 3: Test sign-in with new user
async function testNewUserSignIn() {
  console.log('\n📝 Test 3: Testing sign-in with newly created user...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test2@example.com',
        password: 'password123'
      })
    });

    const result = await response.json();
    console.log(`📡 Response Status: ${response.status}`);
    console.log(`📊 Response Data:`, result);
    
    if (result.success) {
      console.log('✅ New user sign-in successful!');
    } else {
      console.log('❌ New user sign-in failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing new user sign-in:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting authentication tests...\n');
  
  await testSignIn();
  await testSignUp();
  await testNewUserSignIn();
  
  console.log('\n🎯 Authentication tests completed!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Server is running on localhost:3000');
      runAllTests();
    } else {
      console.log('⚠️ Server responded but with error status');
    }
  } catch (error) {
    console.log('❌ Server not running. Please start with: npm run dev');
    console.log('💡 Then run this script again.');
  }
}

checkServer();
