const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Vercel Storage System...\n');

// Test 1: Check if data directory exists
const dataDir = path.join(process.cwd(), 'data');
console.log('📁 Test 1: Checking data directory...');

if (fs.existsSync(dataDir)) {
  console.log(`✅ Data directory exists: ${dataDir}`);
  
  // List all files in data directory
  const files = fs.readdirSync(dataDir);
  console.log(`📋 Files in data directory: ${files.length}`);
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const isFile = stats.isFile();
    
    if (isFile) {
      console.log(`   📄 ${file} (${size} bytes)`);
      
      // Try to read and parse JSON files
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            console.log(`      ✅ Valid JSON array with ${data.length} items`);
          } else {
            console.log(`      ⚠️ Valid JSON but not an array`);
          }
        } catch (error) {
          console.log(`      ❌ Invalid JSON: ${error.message}`);
        }
      }
    } else {
      console.log(`   📁 ${file} (directory)`);
    }
  });
} else {
  console.log('❌ Data directory does not exist');
  console.log('💡 Creating data directory...');
  
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Data directory created successfully');
  } catch (error) {
    console.log('❌ Failed to create data directory:', error.message);
  }
}

// Test 2: Check specific data files
console.log('\n📊 Test 2: Checking specific data files...');

const dataFiles = [
  'products.json',
  'categories.json', 
  'gallery.json',
  'users.json',
  'orders.json',
  'blogs.json'
];

dataFiles.forEach(filename => {
  const filePath = path.join(dataDir, filename);
  
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        console.log(`✅ ${filename}: ${data.length} items`);
        
        // Show first few items for verification
        if (data.length > 0) {
          const firstItem = data[0];
          const keys = Object.keys(firstItem);
          console.log(`   📋 Sample item keys: ${keys.join(', ')}`);
        }
      } else {
        console.log(`⚠️ ${filename}: Not an array`);
      }
    } catch (error) {
      console.log(`❌ ${filename}: Invalid JSON - ${error.message}`);
    }
  } else {
    console.log(`❌ ${filename}: File not found`);
  }
});

// Test 3: Test file permissions
console.log('\n🔐 Test 3: Testing file permissions...');

const testFile = path.join(dataDir, 'test-permissions.json');
const testData = { test: true, timestamp: new Date().toISOString() };

try {
  // Try to write a test file
  fs.writeFileSync(testFile, JSON.stringify(testData, null, 2));
  console.log('✅ Write permission: OK');
  
  // Try to read the test file
  const readContent = fs.readFileSync(testFile, 'utf8');
  const readData = JSON.parse(readContent);
  console.log('✅ Read permission: OK');
  
  // Try to delete the test file
  fs.unlinkSync(testFile);
  console.log('✅ Delete permission: OK');
  
  console.log('✅ All file permissions working correctly');
} catch (error) {
  console.log(`❌ File permission test failed: ${error.message}`);
}

console.log('\n🎯 Vercel Storage Test Completed!');
console.log('💡 If all tests pass, the storage system is working correctly.');
console.log('🚀 Ready for deployment to Vercel!');
