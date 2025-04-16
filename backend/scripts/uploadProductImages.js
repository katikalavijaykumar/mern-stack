import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to update product images
const updateProductImages = async (productId, imageFiles) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Delete old images if they exist
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        const oldImagePath = path.join(process.cwd(), 'backend', image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Add new images
    const newImages = imageFiles.map(file => `/uploads/${file.filename}`);
    product.images = newImages;

    await product.save();
    console.log('Product images updated successfully');
    return product;
  } catch (error) {
    console.error('Error updating product images:', error);
    throw error;
  }
};

// Function to handle image upload
const handleImageUpload = async (productId, imagePath) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Delete old image if it exists
    if (product.image) {
      const oldImagePath = path.join(process.cwd(), 'backend', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update product with new image
    product.image = `/uploads/${path.basename(imagePath)}`;
    await product.save();
    console.log('Product image updated successfully');
    return product;
  } catch (error) {
    console.error('Error updating product image:', error);
    throw error;
  }
};

// Example usage
const main = async () => {
  try {
    // Example: Update a product's main image
    const productId = 'YOUR_PRODUCT_ID'; // Replace with actual product ID
    const imagePath = 'path/to/your/image.jpg'; // Replace with actual image path
    
    await handleImageUpload(productId, imagePath);
    console.log('Image upload completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
};

// Uncomment to run the script
// main();

export { handleImageUpload, updateProductImages, upload }; 