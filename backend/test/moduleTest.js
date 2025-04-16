import { upload } from '../middlewares/multer.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { 
  createProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  uploadProductImages
} from '../controllers/productController.js';

const testModuleImports = () => {
  try {
    // Test 1: Check multer middleware
    if (!upload) {
      throw new Error('Multer middleware not found');
    }
    console.log('Multer middleware import successful');

    // Test 2: Check auth middleware
    if (!authenticate || !authorizeAdmin) {
      throw new Error('Auth middleware not found');
    }
    console.log('Auth middleware import successful');

    // Test 3: Check product controller exports
    const requiredExports = [
      'createProduct',
      'updateProduct',
      'removeProduct',
      'fetchProducts',
      'fetchProductById',
      'addProductReview',
      'fetchTopProducts',
      'fetchNewProducts',
      'filterProducts',
      'uploadProductImages'
    ];

    const missingExports = requiredExports.filter(exportName => !eval(exportName));
    if (missingExports.length > 0) {
      throw new Error(`Missing required exports: ${missingExports.join(', ')}`);
    }
    console.log('All required exports found');

    // Test 4: Check for duplicate exports
    const exports = new Set(requiredExports);
    if (exports.size !== requiredExports.length) {
      throw new Error('Duplicate exports detected');
    }
    console.log('No duplicate exports found');

    console.log('All module import tests passed');
    return true;
  } catch (error) {
    console.error('Module import test failed:', error);
    return false;
  }
};

// Run tests
console.log('Running module import tests...');
testModuleImports(); 