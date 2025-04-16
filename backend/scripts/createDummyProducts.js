import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to create slug from name
const createSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Dummy products data
const dummyProducts = [
  {
    name: "Classic Black Abaya",
    slug: "classic-black-abaya",
    description: "Elegant black abaya with intricate embroidery",
    price: 99.99,
    category: "Abayas",
    brand: "Luxury",
    countInStock: 10,
    image: "/uploads/black-abaya.jpg",
    rating: 4.5,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Embroidered Abaya",
    slug: "embroidered-abaya",
    description: "Beautiful abaya with gold embroidery",
    price: 129.99,
    category: "Abayas",
    brand: "Premium",
    countInStock: 15,
    image: "/uploads/embroidered-abaya.jpg",
    rating: 4.8,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Casual Abaya",
    slug: "casual-abaya",
    description: "Comfortable everyday abaya",
    price: 79.99,
    category: "Abayas",
    brand: "Casual",
    countInStock: 20,
    image: "/uploads/casual-abaya.jpg",
    rating: 4.2,
    numReviews: 0,
    isFeatured: false
  }
];

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create dummy products
const createDummyProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create new products
    const createdProducts = await Product.insertMany(dummyProducts);
    console.log('Created dummy products:', createdProducts);

    // Create dummy image files
    const dummyImages = [
      { name: 'black-abaya.jpg', content: 'Dummy image content' },
      { name: 'embroidered-abaya.jpg', content: 'Dummy image content' },
      { name: 'casual-abaya.jpg', content: 'Dummy image content' }
    ];

    for (const image of dummyImages) {
      const imagePath = path.join(uploadsDir, image.name);
      fs.writeFileSync(imagePath, image.content);
      console.log(`Created dummy image: ${image.name}`);
    }

    console.log('Dummy products and images created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating dummy products:', error);
    process.exit(1);
  }
};

createDummyProducts(); 