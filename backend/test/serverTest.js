import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const testServerInitialization = async () => {
  try {
    // Test 1: Check if port is available
    const app = express();
    const port = process.env.PORT || 5000;
    
    app.listen(port, () => {
      console.log(`Test server running on port: ${port}`);
      process.exit(0);
    });
  } catch (error) {
    console.error('Server initialization test failed:', error);
    process.exit(1);
  }
};

const testEnvironmentVariables = () => {
  try {
    // Test 2: Check required environment variables
    const requiredVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    console.log('Environment variables test passed');
    return true;
  } catch (error) {
    console.error('Environment variables test failed:', error);
    return false;
  }
};

// Run tests
console.log('Running server initialization tests...');
testEnvironmentVariables();
testServerInitialization(); 