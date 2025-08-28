const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersPath = path.join(dataDir, 'users.json');

// Test user data
const testUser = {
  id: 'test-user-' + Date.now(),
  name: 'Test User',
  email: 'test@example.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  signInCount: 0
};

// Load existing users or start with empty array
let users = [];
if (fs.existsSync(usersPath)) {
  try {
    const data = fs.readFileSync(usersPath, 'utf8');
    users = JSON.parse(data);
    console.log(`📁 Loaded ${users.length} existing users`);
  } catch (error) {
    console.log('⚠️ Error loading existing users, starting fresh');
  }
}

// Check if test user already exists
const existingUser = users.find(u => u.email === testUser.email);
if (existingUser) {
  console.log('✅ Test user already exists');
} else {
  // Add test user
  users.push(testUser);
  
  // Save to file
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log('✅ Test user created successfully');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password: password');
  } catch (error) {
    console.error('❌ Error saving test user:', error);
  }
}

console.log(`👥 Total users: ${users.length}`);
console.log('📁 Users file location:', usersPath);
