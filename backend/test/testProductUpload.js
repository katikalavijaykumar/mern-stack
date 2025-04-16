import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const TEST_IMAGE_PATH = path.join(process.cwd(), 'backend', 'test', 'test-image.svg');

// Create an axios instance that handles cookies
const axiosInstance = axios.create({
  withCredentials: true
});

async function testProductUpload() {
  try {
    // First, login to get the token
    console.log('Attempting to login...');
    const loginResponse = await axiosInstance.post(`${API_URL}/users/auth`, {
      email: 'mamtabenrji0230204@gmail.com',
      password: 'admin123'
    });

    console.log('Login response:', loginResponse.data);

    // Create form data for product creation
    const formData = new FormData();
    formData.append('name', 'Test Product');
    formData.append('description', 'This is a test product');
    formData.append('price', '99.99');
    formData.append('category', 'Test Category');
    formData.append('brand', 'Test Brand');
    formData.append('countInStock', '10');
    formData.append('image', fs.createReadStream(TEST_IMAGE_PATH));

    console.log('Attempting to create product...');
    // Create product
    const createResponse = await axiosInstance.post(`${API_URL}/products`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('Product created successfully:', createResponse.data);
  } catch (error) {
    console.error('Error in test:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testProductUpload(); 