import express from 'express';
import { uploadImage, deleteImage, getUploads } from '../controllers/uploadController.js';
import { upload } from '../config/multer.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.route('/')
  .post(authenticate, authorizeAdmin, upload.single('image'), uploadImage)
  .get(authenticate, authorizeAdmin, getUploads);

router.route('/:id')
  .delete(authenticate, authorizeAdmin, deleteImage);

// @desc    Test image upload
// @route   POST /api/upload/test
// @access  Public (for testing only)
router.post('/test', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    console.log('File details:', req.file);
    res.status(200).json({ 
      message: 'Image uploaded successfully',
      file: req.file 
    });
  } catch (error) {
    console.error('Error in test upload:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
