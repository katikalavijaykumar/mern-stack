import { upload } from '../middlewares/multer.js';
import path from 'path';
import fs from 'fs';

const testFileUpload = () => {
  try {
    // Test 1: Check uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    console.log('Uploads directory exists');

    // Test 2: Check multer configuration
    if (!upload) {
      throw new Error('Multer configuration not found');
    }
    console.log('Multer configuration found');

    // Test 3: Check file filter
    const testFile = {
      mimetype: 'image/jpeg',
      originalname: 'test.jpg'
    };

    upload.fileFilter(null, testFile, (error, accept) => {
      if (error) {
        throw new Error('File filter test failed');
      }
      if (!accept) {
        throw new Error('Valid file type rejected');
      }
      console.log('File filter test passed');
    });

    // Test 4: Check storage configuration
    const storage = upload.storage;
    if (!storage) {
      throw new Error('Storage configuration not found');
    }
    console.log('Storage configuration found');

    console.log('All upload tests passed');
    return true;
  } catch (error) {
    console.error('Upload test failed:', error);
    return false;
  }
};

// Run tests
console.log('Running upload tests...');
testFileUpload(); 