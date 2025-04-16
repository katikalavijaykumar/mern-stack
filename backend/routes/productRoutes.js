import express from "express";
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
import { upload } from '../middlewares/multer.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import checkId from "../middlewares/checkId.js";

const router = express.Router();

// Route debug helper
router.get('/routes', (req, res) => {
  const routes = [];
  router.stack.forEach(route => {
    if (route.route) {
      routes.push({
        path: route.route.path,
        methods: Object.keys(route.route.methods)
      });
    }
  });
  res.json({ routes });
});

// Public routes - specific routes first
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

// Filter products - make sure it's defined before the :id param route
router.post("/filter", filterProducts);
// Also add a GET version for compatibility
router.get("/filtered-products", filterProducts);

// Routes with parameters
router.get("/:id", checkId, fetchProductById);

// Root route for fetching all products
router.get("/", fetchProducts);

// Protected routes
router.post("/:id/reviews", authenticate, checkId, addProductReview);

// Admin routes
router.post("/", authenticate, authorizeAdmin, upload.single('image'), createProduct);
router.put("/:id", authenticate, authorizeAdmin, checkId, upload.single('image'), updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, checkId, removeProduct);
router.post("/:id/images", authenticate, authorizeAdmin, checkId, upload.array('images', 5), uploadProductImages);

export default router;
