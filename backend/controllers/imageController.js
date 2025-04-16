import Image from '../models/imageModel.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all images
// @route   GET /api/images
// @access  Private/Admin
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate('uploadedBy', 'name email')
      .populate('product', 'name');
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
// @access  Private/Admin
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('product', 'name');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Remove file from filesystem
    fs.unlink(image.path, async (err) => {
      if (err) {
        console.error('Error removing file:', err);
        return res.status(500).json({ message: 'Error removing file', error: err.message });
      }

      // Remove record from database
      await image.deleteOne();
      res.json({ message: 'Image deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};

// @desc    Get images by product ID
// @route   GET /api/images/product/:productId
// @access  Public
export const getImagesByProduct = async (req, res) => {
  try {
    const images = await Image.find({ product: req.params.productId })
      .populate('uploadedBy', 'name');
    res.json(images);
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({ message: 'Error fetching product images', error: error.message });
  }
}; 