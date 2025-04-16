import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000/api';
const TEST_IMAGE_PATH = path.join(__dirname, 'test-images', 'test-product.jpg');

// Check if test image exists
if (!fs.existsSync(TEST_IMAGE_PATH)) {
  console.error('❌ Test image not found at:', TEST_IMAGE_PATH);
  console.log('Please create a test image at:', TEST_IMAGE_PATH);
  process.exit(1);
}

// Helper function to create form data with image
const createFormData = (fields, imagePath) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (imagePath) {
    formData.append('image', fs.createReadStream(imagePath));
  }
  return formData;
};

// Test image upload
const testImageUpload = async () => {
  try {
    // 1. Test uploading image without authentication
    console.log('\n1. Testing image upload without authentication...');
    try {
      const formData = createFormData({}, TEST_IMAGE_PATH);
      await axios.post(`${BASE_URL}/products`, formData, {
        headers: formData.getHeaders()
      });
      console.log('❌ Should have failed - unauthorized access');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ Server not running. Please start the server with: npm run dev');
        process.exit(1);
      }
      console.log('✅ Success - unauthorized access blocked');
    }

    // 2. Test uploading image with normal user
    console.log('\n2. Testing image upload with normal user...');
    try {
      // Login as normal user
      const loginResponse = await axios.post(`${BASE_URL}/users/auth`, {
        email: 'user@example.com',
        password: '123456'
      });
      const token = loginResponse.data.token;

      const formData = createFormData({}, TEST_IMAGE_PATH);
      await axios.post(`${BASE_URL}/products`, formData, {
        headers: {
          ...formData.getHeaders(),
          Cookie: `jwt=${token}`
        }
      });
      console.log('❌ Should have failed - non-admin access');
    } catch (error) {
      console.log('✅ Success - non-admin access blocked');
    }

    // 3. Test uploading image with admin user
    console.log('\n3. Testing image upload with admin user...');
    try {
      // Login as admin
      const loginResponse = await axios.post(`${BASE_URL}/users/auth`, {
        email: 'mamtabenrji0230204@gmail.com', // Use your actual admin email
        password: 'admin123' // Use your actual admin password
      });
      const token = loginResponse.data.token;

      const formData = createFormData({
        name: 'Test Product',
        description: 'Test Description',
        price: '100',
        category: 'Test Category',
        brand: 'Test Brand',
        countInStock: '10'
      }, TEST_IMAGE_PATH);

      const response = await axios.post(`${BASE_URL}/products`, formData, {
        headers: {
          ...formData.getHeaders(),
          Cookie: `jwt=${token}`
        }
      });
      console.log('✅ Success - image uploaded:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('❌ Server responded with error:', error.response.data);
      } else if (error.request) {
        console.log('❌ No response received from server');
      } else {
        console.log('❌ Error setting up request:', error.message);
      }
      throw error;
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run tests
testImageUpload(); 