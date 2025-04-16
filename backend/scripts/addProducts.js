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

// Products data
const products = [
  // Abayas
  {
    name: "Classic Black Abaya",
    slug: "classic-black-abaya",
    description: "Elegant black abaya with intricate embroidery and comfortable fit",
    price: 99.99,
    category: "Abayas",
    brand: "Luxury",
    countInStock: 15,
    image: "/uploads/black-abaya.jpg",
    rating: 4.5,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Embroidered Gold Abaya",
    slug: "embroidered-gold-abaya",
    description: "Beautiful abaya with gold embroidery and flowing design",
    price: 129.99,
    category: "Abayas",
    brand: "Premium",
    countInStock: 10,
    image: "/uploads/gold-abaya.jpg",
    rating: 4.8,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Casual Everyday Abaya",
    slug: "casual-everyday-abaya",
    description: "Comfortable and stylish abaya perfect for daily wear",
    price: 79.99,
    category: "Abayas",
    brand: "Casual",
    countInStock: 20,
    image: "/uploads/casual-abaya.jpg",
    rating: 4.2,
    numReviews: 0,
    isFeatured: false
  },

  // Hijabs
  {
    name: "Silk Hijab Set",
    slug: "silk-hijab-set",
    description: "Luxurious silk hijab set with matching undercap",
    price: 49.99,
    category: "Hijabs",
    brand: "Luxury",
    countInStock: 25,
    image: "/uploads/silk-hijab.jpg",
    rating: 4.7,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Cotton Hijab Collection",
    slug: "cotton-hijab-collection",
    description: "Breathable cotton hijabs in various colors",
    price: 29.99,
    category: "Hijabs",
    brand: "Casual",
    countInStock: 30,
    image: "/uploads/cotton-hijab.jpg",
    rating: 4.3,
    numReviews: 0,
    isFeatured: false
  },

  // Accessories
  {
    name: "Pearl Hijab Pins",
    slug: "pearl-hijab-pins",
    description: "Elegant pearl hijab pins for secure styling",
    price: 19.99,
    category: "Accessories",
    brand: "Luxury",
    countInStock: 50,
    image: "/uploads/pearl-pins.jpg",
    rating: 4.6,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Hijab Magnet Set",
    slug: "hijab-magnet-set",
    description: "Convenient hijab magnets for easy styling",
    price: 14.99,
    category: "Accessories",
    brand: "Casual",
    countInStock: 40,
    image: "/uploads/hijab-magnets.jpg",
    rating: 4.4,
    numReviews: 0,
    isFeatured: false
  },

  // Special Occasion
  {
    name: "Wedding Abaya Set",
    slug: "wedding-abaya-set",
    description: "Luxurious wedding abaya with matching accessories",
    price: 199.99,
    category: "Special Occasion",
    brand: "Premium",
    countInStock: 5,
    image: "/uploads/wedding-abaya.jpg",
    rating: 4.9,
    numReviews: 0,
    isFeatured: true
  },
  {
    name: "Eid Collection Abaya",
    slug: "eid-collection-abaya",
    description: "Elegant abaya perfect for Eid celebrations",
    price: 149.99,
    category: "Special Occasion",
    brand: "Luxury",
    countInStock: 8,
    image: "/uploads/eid-abaya.jpg",
    rating: 4.7,
    numReviews: 0,
    isFeatured: true
  }
];

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Add products to database
const addProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add new products
    const createdProducts = await Product.insertMany(products);
    console.log('Created products:', createdProducts);

    // Create dummy image files
    const dummyImages = [
      { name: 'black-abaya.jpg', content: 'Dummy image content' },
      { name: 'gold-abaya.jpg', content: 'Dummy image content' },
      { name: 'casual-abaya.jpg', content: 'Dummy image content' },
      { name: 'silk-hijab.jpg', content: 'Dummy image content' },
      { name: 'cotton-hijab.jpg', content: 'Dummy image content' },
      { name: 'pearl-pins.jpg', content: 'Dummy image content' },
      { name: 'hijab-magnets.jpg', content: 'Dummy image content' },
      { name: 'wedding-abaya.jpg', content: 'Dummy image content' },
      { name: 'eid-abaya.jpg', content: 'Dummy image content' }
    ];

    for (const image of dummyImages) {
      const imagePath = path.join(uploadsDir, image.name);
      fs.writeFileSync(imagePath, image.content);
      console.log(`Created dummy image: ${image.name}`);
    }

    console.log('Products and images created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating products:', error);
    process.exit(1);
  }
};

addProducts(); 