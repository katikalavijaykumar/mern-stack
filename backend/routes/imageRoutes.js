import express from 'express';
import {
  getAllImages,
  getImageById,
  deleteImage,
  getImagesByProduct
} from '../controllers/imageController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllImages);
router.get('/:id', authenticate, authorizeAdmin, getImageById);
router.delete('/:id', authenticate, authorizeAdmin, deleteImage);

// Public routes
router.get('/product/:productId', getImagesByProduct);

export default router; 