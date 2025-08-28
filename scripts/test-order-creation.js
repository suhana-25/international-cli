const fs = require('fs');
const path = require('path');

// Test order creation
const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

console.log('Testing order creation...');
console.log('Data directory:', DATA_DIR);
console.log('Orders file:', ORDERS_FILE);

// Check if data directory exists
if (!fs.existsSync(DATA_DIR)) {
  console.log('Creating data directory...');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Check if orders file exists
if (!fs.existsSync(ORDERS_FILE)) {
  console.log('Creating orders file...');
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// Load current orders
let orders = [];
try {
  const data = fs.readFileSync(ORDERS_FILE, 'utf8');
  orders = JSON.parse(data);
  console.log('Current orders in file:', orders.length);
} catch (error) {
  console.error('Error loading orders:', error);
}

// Create a test order
const testOrder = {
  id: `ORD-${Date.now()}-test-${Math.random().toString(36).substr(2, 9)}`,
  userId: 'test-user-456',
  items: [
    {
      id: 'test-product-2',
      name: 'Test Product 2',
      price: 49.99,
      quantity: 1,
      image: '/test-image-2.jpg'
    }
  ],
  total: 49.99,
  shippingAddress: {
    fullName: 'Test User',
    streetAddress: '456 Test Avenue',
    city: 'Test City',
    country: 'Test Country',
    postalCode: '54321',
    phone: '+1234567890'
  },
  paymentMethod: 'paypal',
  status: 'pending',
  isPaid: false,
  isDelivered: false,
  createdAt: new Date().toISOString()
};

console.log('Creating test order:', testOrder);

// Add test order
orders.push(testOrder);

// Save orders
try {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  console.log('Test order saved successfully!');
  console.log('Total orders in file:', orders.length);
} catch (error) {
  console.error('Error saving test order:', error);
}

// Verify the order was saved
try {
  const savedData = fs.readFileSync(ORDERS_FILE, 'utf8');
  const savedOrders = JSON.parse(savedData);
  console.log('Verification - orders in file after save:', savedOrders.length);
  console.log('Last order ID:', savedOrders[savedOrders.length - 1]?.id);
} catch (error) {
  console.error('Error verifying saved order:', error);
}
