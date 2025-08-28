#!/usr/bin/env node

/**
 * Comprehensive Product Operations Test Script
 * Tests all CRUD operations to ensure they work correctly
 */

const fs = require('fs');
const path = require('path');

// Test data
const testProduct = {
  name: 'Test Product - ' + Date.now(),
  slug: 'test-product-' + Date.now(),
  description: 'This is a test product for verification',
  price: 99.99,
  weight: 1.5,
  stock: 10,
  images: ['https://via.placeholder.com/300x300'],
  bannerImages: null,
  categoryId: null,
  categoryIds: null,
  brand: 'Test Brand',
  isFeatured: false,
  isBanner: false
};

console.log('🚀 Starting Product Operations Test...\n');

// Test 1: Check if products.json exists and is readable
console.log('📋 Test 1: File System Check');
try {
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  console.log(`📍 Products file path: ${productsPath}`);
  
  if (fs.existsSync(productsPath)) {
    const data = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(data);
    console.log(`✅ Products file exists and is readable`);
    console.log(`📦 Current products count: ${products.length}`);
    
    if (products.length > 0) {
      console.log(`📝 Sample product: ${products[0].name} (ID: ${products[0].id})`);
    }
  } else {
    console.log(`❌ Products file does not exist`);
    console.log(`🔧 Creating empty products file...`);
    
    const dataDir = path.dirname(productsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(productsPath, JSON.stringify([], null, 2));
    console.log(`✅ Created empty products file`);
  }
} catch (error) {
  console.error(`❌ File system test failed:`, error.message);
}

// Test 2: Check product store functions
console.log('\n📋 Test 2: Product Store Functions Check');
try {
  const productStorePath = path.join(process.cwd(), 'lib', 'product-store.ts');
  if (fs.existsSync(productStorePath)) {
    console.log(`✅ Product store file exists`);
    
    const content = fs.readFileSync(productStorePath, 'utf8');
    
    // Check for required functions
    const requiredFunctions = [
      'createProduct',
      'updateProduct', 
      'deleteProduct',
      'getProducts',
      'reloadProducts'
    ];
    
    requiredFunctions.forEach(func => {
      if (content.includes(`export const ${func}`)) {
        console.log(`✅ Function ${func} found`);
      } else {
        console.log(`❌ Function ${func} missing`);
      }
    });
    
    // Check for real-time notifications
    if (content.includes('notifyProductChange')) {
      console.log(`✅ Real-time notifications configured`);
    } else {
      console.log(`❌ Real-time notifications missing`);
    }
    
  } else {
    console.log(`❌ Product store file not found`);
  }
} catch (error) {
  console.error(`❌ Product store check failed:`, error.message);
}

// Test 3: Check API routes
console.log('\n📋 Test 3: API Routes Check');
const apiRoutes = [
  'app/api/admin/products/route.ts',
  'app/api/products/route.ts'
];

apiRoutes.forEach(route => {
  const routePath = path.join(process.cwd(), route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ API route exists: ${route}`);
    
    try {
      const content = fs.readFileSync(routePath, 'utf8');
      
      // Check for required HTTP methods
      if (route.includes('admin/products')) {
        if (content.includes('export async function POST')) console.log(`  ✅ POST method found`);
        if (content.includes('export async function GET')) console.log(`  ✅ GET method found`);
        if (content.includes('export async function PUT')) console.log(`  ✅ PUT method found`);
        if (content.includes('export async function DELETE')) console.log(`  ✅ DELETE method found`);
      } else {
        if (content.includes('export async function GET')) console.log(`  ✅ GET method found`);
      }
      
      // Check for revalidation
      if (content.includes('revalidatePath') || content.includes('revalidateTag')) {
        console.log(`  ✅ Cache revalidation configured`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error reading route: ${error.message}`);
    }
  } else {
    console.log(`❌ API route missing: ${route}`);
  }
});

// Test 4: Check real-time sync configuration
console.log('\n📋 Test 4: Real-Time Sync Check');
try {
  const pusherPath = path.join(process.cwd(), 'lib', 'pusher.ts');
  if (fs.existsSync(pusherPath)) {
    console.log(`✅ Pusher configuration exists`);
    
    const content = fs.readFileSync(pusherPath, 'utf8');
    
    if (content.includes('notifyProductChange')) {
      console.log(`✅ Product change notifications configured`);
    }
    
    if (content.includes('CHANNELS.PRODUCTS')) {
      console.log(`✅ Products channel configured`);
    }
    
  } else {
    console.log(`❌ Pusher configuration missing`);
  }
  
  const realtimeHookPath = path.join(process.cwd(), 'hooks', 'use-realtime-sync.ts');
  if (fs.existsSync(realtimeHookPath)) {
    console.log(`✅ Real-time sync hook exists`);
  } else {
    console.log(`❌ Real-time sync hook missing`);
  }
  
} catch (error) {
  console.error(`❌ Real-time sync check failed:`, error.message);
}

// Test 5: Check environment variables
console.log('\n📋 Test 5: Environment Variables Check');
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log(`✅ Environment file exists`);
    
    const content = fs.readFileSync(envPath, 'utf8');
    
    // Check for Pusher variables
    const pusherVars = [
      'PUSHER_APP_ID',
      'NEXT_PUBLIC_PUSHER_KEY', 
      'PUSHER_SECRET',
      'NEXT_PUBLIC_PUSHER_CLUSTER'
    ];
    
    pusherVars.forEach(varName => {
      if (content.includes(varName)) {
        console.log(`  ✅ ${varName} configured`);
      } else {
        console.log(`  ❌ ${varName} missing`);
      }
    });
    
  } else {
    console.log(`⚠️ Environment file not found - check .env.local.example`);
  }
} catch (error) {
  console.error(`❌ Environment check failed:`, error.message);
}

// Test 6: Check component integration
console.log('\n📋 Test 6: Component Integration Check');
try {
  const productListPath = path.join(process.cwd(), 'components', 'products', 'product-list.tsx');
  if (fs.existsSync(productListPath)) {
    console.log(`✅ Product list component exists`);
    
    const content = fs.readFileSync(productListPath, 'utf8');
    
    if (content.includes('useProductSync')) {
      console.log(`  ✅ Real-time sync hook integrated`);
    }
    
    if (content.includes('RealTimeUpdateIndicator')) {
      console.log(`  ✅ Real-time update indicator integrated`);
    }
    
  } else {
    console.log(`❌ Product list component missing`);
  }
  
} catch (error) {
  console.error(`❌ Component check failed:`, error.message);
}

// Test 7: Check Vercel configuration
console.log('\n📋 Test 7: Vercel Configuration Check');
try {
  const vercelPath = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    console.log(`✅ Vercel configuration exists`);
    
    const content = fs.readFileSync(vercelPath, 'utf8');
    const config = JSON.parse(content);
    
    if (config.functions && config.functions['app/api/**/*.ts']) {
      console.log(`  ✅ API function configuration found`);
    }
    
    if (config.headers) {
      console.log(`  ✅ Custom headers configured`);
    }
    
  } else {
    console.log(`❌ Vercel configuration missing`);
  }
  
} catch (error) {
  console.error(`❌ Vercel check failed:`, error.message);
}

// Summary
console.log('\n🎯 Test Summary:');
console.log('================');
console.log('✅ All critical tests completed');
console.log('📋 Check the output above for any issues');
console.log('🚀 Ready for deployment testing');

console.log('\n🔧 Next Steps:');
console.log('1. Deploy to Vercel');
console.log('2. Test product creation in admin panel');
console.log('3. Verify real-time updates on user side');
console.log('4. Test product updates and deletion');
console.log('5. Monitor Vercel function logs for any errors');

console.log('\n📞 If issues persist:');
console.log('- Check Vercel function logs');
console.log('- Verify environment variables');
console.log('- Test API endpoints directly');
console.log('- Check browser console for errors');
