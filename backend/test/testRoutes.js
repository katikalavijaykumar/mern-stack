import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const ROUTES = [
  '/test',
  '/api/db-status',
  '/api/products',
  '/api/products/routes',
  '/api/products/top',
  '/api/products/new',
  '/api/products/filtered-products?checked=[]&radio=[]',
  '/api/users',
  '/api/category/categories'
];

async function testRoutes() {
  console.log('Starting API route tests...\n');
  
  for (const route of ROUTES) {
    try {
      console.log(`Testing route: ${route}`);
      const response = await fetch(`${BASE_URL}${route}`);
      const status = response.status;
      
      console.log(`  Status: ${status}`);
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log(`  Response: ${JSON.stringify(data).substring(0, 100)}${JSON.stringify(data).length > 100 ? '...' : ''}`);
        } catch (e) {
          console.log(`  Error parsing JSON: ${e.message}`);
        }
      } else {
        console.log(`  Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`  Failed to fetch ${route}: ${error.message}`);
    }
    console.log(''); // Add empty line between routes
  }
  
  console.log('API route tests completed.');
}

// Check if MongoDB is connected
async function testMongoDB() {
  try {
    console.log('Testing MongoDB connection...');
    const response = await fetch(`${BASE_URL}/api/db-status`);
    const data = await response.json();
    
    console.log('MongoDB connection status:');
    console.log(JSON.stringify(data, null, 2));
    
    return data.connected;
  } catch (error) {
    console.error(`Failed to check MongoDB connection: ${error.message}`);
    return false;
  }
}

// Test image upload
async function testImageUpload() {
  // Not implemented in this basic test script
  // Would require FormData and file upload capabilities
  console.log('Image upload test not implemented in this script');
}

// Run all tests
async function runAllTests() {
  console.log('===== API TESTS =====\n');
  
  // Test routes
  await testRoutes();
  
  console.log('\n===== MONGODB TEST =====\n');
  
  // Test MongoDB
  const isConnected = await testMongoDB();
  
  console.log('\n===== TEST SUMMARY =====\n');
  console.log(`API Routes: Completed`);
  console.log(`MongoDB: ${isConnected ? 'Connected' : 'Not connected'}`);
  
  process.exit(0);
}

runAllTests(); 