const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

console.log('🧪 Simple Authentication Test...\n');

// Test 1: Check if users.json exists and has data
const usersPath = path.join(process.cwd(), 'data', 'users.json');
console.log('📁 Test 1: Checking users.json...');

if (fs.existsSync(usersPath)) {
  const usersData = fs.readFileSync(usersPath, 'utf8');
  const users = JSON.parse(usersData);
  console.log(`✅ users.json exists with ${users.length} users`);
  
  // Display all users
  users.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    console.log(`      Password hash: ${user.password.substring(0, 20)}...`);
  });
} else {
  console.log('❌ users.json does not exist');
  process.exit(1);
}

// Test 2: Test password verification
console.log('\n🔐 Test 2: Testing password verification...');

const usersArray = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const testUser = usersArray.find(u => u.email === 'test@example.com');
if (testUser) {
  console.log(`✅ Found test user: ${testUser.name}`);
  
  // Test with correct password
  const correctPassword = 'password';
  const isCorrect = bcrypt.compareSync(correctPassword, testUser.password);
  console.log(`🔑 Correct password test: ${isCorrect ? '✅ PASS' : '❌ FAIL'}`);
  
  // Test with wrong password
  const wrongPassword = 'wrongpassword';
  const isWrong = bcrypt.compareSync(wrongPassword, testUser.password);
  console.log(`🔑 Wrong password test: ${isWrong ? '❌ FAIL' : '✅ PASS'}`);
  
} else {
  console.log('❌ Test user not found');
}

// Test 3: Test user lookup functions
console.log('\n🔍 Test 3: Testing user lookup...');

const getUserByEmail = (email) => {
  return usersArray.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const testEmail = 'test@example.com';
const foundUser = getUserByEmail(testEmail);
if (foundUser) {
  console.log(`✅ getUserByEmail('${testEmail}') found: ${foundUser.name}`);
} else {
  console.log(`❌ getUserByEmail('${testEmail}') failed`);
}

console.log('\n🎯 Authentication test completed!');
console.log('💡 If all tests pass, the issue might be in the API route or form submission.');
