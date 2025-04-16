import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000/api';
const TEST_IMAGE_PATH = path.join(__dirname, 'test-images', 'test-product.jpg');

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

// Test cases
const testProductEndpoints = async () => {
  try {
    // 1. Test creating product without authentication
    console.log('\n1. Testing create product without authentication...');
    try {
      const formData = createFormData({
        name: 'Test Product',
        description: 'Test Description',
        price: '100',
        category: 'Test Category',
        brand: 'Test Brand',
        countInStock: '10'
      }, TEST_IMAGE_PATH);

      await axios.post(`${BASE_URL}/products`, formData, {
        headers: formData.getHeaders()
      });
      console.log('❌ Should have failed - unauthorized access');
    } catch (error) {
      console.log('✅ Success - unauthorized access blocked');
    }

    // 2. Test creating product with normal user
    console.log('\n2. Testing create product with normal user...');
    try {
      // Login as normal user
      const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
        email: 'user@example.com',
        password: '123456'
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

    // 3. Test creating product with admin user
    console.log('\n3. Testing create product with admin user...');
    try {
      // Login as admin
      const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
        email: 'admin@example.com',
        password: '123456'
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
      console.log('✅ Success - product created:', response.data);
      return response.data._id; // Return product ID for further tests
    } catch (error) {
      console.log('❌ Failed to create product:', error.response?.data || error.message);
      throw error;
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run tests
testProductEndpoints(); 