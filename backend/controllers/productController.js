import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import path from 'path';
import fs from 'fs';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    // Log the request for debugging
    console.log('Creating product with request:');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('File:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename,
      path: req.file.path
    } : 'No file uploaded');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { name, description, price, category, brand, countInStock } = req.body;

    // Validate required fields
    if (!name?.trim() || !description?.trim() || !price || !category?.trim() || !brand?.trim() || !countInStock) {
      console.log('Missing fields:', {
        name: !name?.trim(),
        description: !description?.trim(),
        price: !price,
        category: !category?.trim(),
        brand: !brand?.trim(),
        countInStock: !countInStock
      });
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    // Validate file upload
    if (!req.file) {
      console.log('No file uploaded in request');
      console.log('Request has a file object:', !!req.file);
      console.log('Request headers:', req.headers);
      console.log('Content-Type:', req.headers['content-type']);
      res.status(400);
      throw new Error("Please upload an image");
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Get the image path
    const imagePath = `/uploads/${req.file.filename}`;
    console.log('Image path:', imagePath);

    // Create product with all required fields
    const product = new Product({
      name,
      slug,
      description,
      price: Number(price),
      category,
      brand,
      countInStock: Number(countInStock),
      image: imagePath,
      user: req.user._id,
      rating: 0,
      numReviews: 0,
      reviews: []
    });

    // Save product to database
    const createdProduct = await product.save();
    console.log('Product created successfully:', createdProduct);
    
    // Return success response
    res.status(201).json({
      _id: createdProduct._id,
      name: createdProduct.name,
      slug: createdProduct.slug,
      description: createdProduct.description,
      price: createdProduct.price,
      category: createdProduct.category,
      brand: createdProduct.brand,
      countInStock: createdProduct.countInStock,
      image: createdProduct.image,
      rating: createdProduct.rating,
      numReviews: createdProduct.numReviews,
      reviews: createdProduct.reviews,
      createdAt: createdProduct.createdAt,
      updatedAt: createdProduct.updatedAt
    });
  } catch (error) {
    console.error('Error creating product:', error);
    // If there's a file uploaded but product creation failed, delete the file
    if (req.file) {
      const filePath = path.join(process.cwd(), 'backend', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted uploaded file due to error:', filePath);
      }
    }
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error creating product'
    });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, countInStock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock || product.countInStock;

    if (req.file) {
      // Delete old image if it exists
      if (product.image) {
        const oldImagePath = path.join(process.cwd(), 'backend', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete product image if it exists
    if (product.image) {
      const imagePath = path.join(process.cwd(), 'backend', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
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
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  console.log('Review submission received:');
  console.log('Product ID:', req.params.id);
  console.log('User:', req.user ? { 
    id: req.user._id, 
    username: req.user.username,
    name: req.user.name, 
    email: req.user.email 
  } : 'No user data');
  console.log('Review data:', { rating, comment });
  
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found with ID:', req.params.id);
      res.status(404);
      throw new Error("Product not found");
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      console.log('User already reviewed this product');
      res.status(400);
      throw new Error("Product already reviewed");
    }

    // Ensure we have a valid name for the review - multiple fallbacks
    let userName = "Anonymous";
    if (req.user.username) userName = req.user.username;
    else if (req.user.name) userName = req.user.name;
    else if (req.user.email) userName = req.user.email.split('@')[0];
    
    console.log('Using review name:', userName);
    
    const review = {
      name: userName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    console.log('Adding review to product:', review);
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    const updatedProduct = await product.save();
    console.log('Product updated with new review. Total reviews:', updatedProduct.numReviews);
    
    // Return the complete updated product to ensure frontend has fresh data
    res.status(201).json({
      message: "Review added successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error handling review submission:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error submitting review'
    });
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(5);
  res.json(products);
});

// @desc    Filter products
// @route   POST /api/products/filter
// @route   GET /api/products/filtered-products
// @access  Public
const filterProducts = asyncHandler(async (req, res) => {
  try {
    console.log('Filter products request received:');
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    
    let checked = [];
    let radio = [];
    
    // Handle both POST and GET requests
    if (req.method === 'POST') {
      // Extract from request body
      checked = req.body.checked || [];
      radio = req.body.radio || [];
    } else if (req.method === 'GET') {
      // Extract from query parameters
      checked = req.query.checked ? JSON.parse(req.query.checked) : [];
      radio = req.query.radio ? JSON.parse(req.query.radio) : [];
    }
    
    console.log('Processed filters:', { checked, radio });

    // Build the query
    let args = {};
    if (checked && checked.length > 0) args.category = checked;
    if (radio && radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    
    console.log('MongoDB query args:', args);

    // Find products with the specified filters
    const products = await Product.find(args);
    console.log(`Found ${products.length} products matching filters`);
    
    res.json(products);
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json({ 
      message: "Error filtering products",
      error: error.message 
    });
  }
});

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Admin
const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  res.status(200).json({ imageUrls });
});

// Export all functions
export {
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
};
