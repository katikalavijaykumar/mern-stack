import { testProductEndpoints } from './productApiTests.js';

const runTests = async () => {
  console.log('Starting API tests...\n');

  try {
    // Run product API tests
    console.log('Running Product API Tests...');
    await testProductEndpoints();
    
    console.log('\nAll tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nTests failed:', error);
    process.exit(1);
  }
};

runTests(); 