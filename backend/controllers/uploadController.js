import Upload from '../models/uploadModel.js';
import fs from 'fs';
import path from 'path';

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Create upload record in database
    const upload = new Upload({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id
    });

    await upload.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      upload: {
        id: upload._id,
        filename: upload.filename,
        path: upload.path,
        mimetype: upload.mimetype,
        size: upload.size,
        uploadedAt: upload.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    // If there was an error, remove the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error removing file:', err);
      });
    }
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// @desc    Delete an uploaded image
// @route   DELETE /api/upload/:id
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    // Remove the file from the filesystem
    fs.unlink(upload.path, async (err) => {
      if (err) {
        console.error('Error removing file:', err);
        return res.status(500).json({ message: 'Error removing file', error: err.message });
      }

      // Remove the record from database
      await upload.deleteOne();
      res.json({ message: 'File deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};

// @desc    Get all uploaded images
// @route   GET /api/upload
// @access  Private/Admin
export const getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ message: 'Error fetching uploads', error: error.message });
  }
}; 