import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../config/multer.js';
import path from 'path';

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, countInStock, brand } = req.body;
    
    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !countInStock:
        return res.status(400).json({ error: "Count in stock is required" });
      case !req.file:
        return res.status(400).json({ error: "Image is required" });
    }

    // Store relative path for the image
    const imagePath = path.relative(path.join(process.cwd(), 'backend'), req.file.path);

    const product = new Product({
      name,
      description,
      price,
      category,
      countInStock,
      brand,
      image: imagePath
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, countInStock, brand } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.brand = brand || product.brand;
    
    if (req.file) {
      product.image = path.relative(path.join(process.cwd(), 'backend'), req.file.path);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete a product
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ error: 'Failed to remove product', details: error.message });
  }
});

// Get all products
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get product by ID
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
});

// Get all products (admin)
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Failed to fetch all products', details: error.message });
  }
});

// Add product review
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review', details: error.message });
  }
});

// Get top rated products
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products', details: error.message });
  }
});

// Get new products
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error('Error fetching new products:', error);
    res.status(500).json({ error: 'Failed to fetch new products', details: error.message });
  }
});

// Filter products
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating } = req.body;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
    if (rating) query.rating = { $gte: rating };

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ error: 'Failed to filter products', details: error.message });
  }
});

export {
  createProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts
};
