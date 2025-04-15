import express from "express";
import { 
  createProduct, 
  fetchProducts, 
  fetchProductById, 
  updateProduct, 
  removeProduct,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts 
} from '../controllers/productController.js';
import { upload } from '../config/multer.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import checkId from "../middlewares/checkId.js";
import Product from "../models/productModel.js";

const router = express.Router();

// Public routes
router.get("/", fetchProducts);
router.get("/all", fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.get("/:id", fetchProductById);
router.post("/filter", filterProducts);

// Protected routes
router.post("/:id/reviews", authenticate, checkId, addProductReview);

// Admin routes
router.post("/", authenticate, authorizeAdmin, upload.single('image'), createProduct);
router.put("/:id", authenticate, authorizeAdmin, upload.single('image'), updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, removeProduct);

// Route for uploading multiple images
router.post('/:id/images', authenticate, authorizeAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const newImages = req.files.map(file => file.path);
      product.images = [...product.images, ...newImages];
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
