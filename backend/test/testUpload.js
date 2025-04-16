import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 5555;

// Enable CORS
app.use(cors());

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
console.log('Test uploads directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at:', uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination called for file:', file.originalname);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log('Filename called for file:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  console.log('File being uploaded:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    fieldname: file.fieldname
  });

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    console.log('File type accepted:', file.mimetype);
    cb(null, true);
  } else {
    console.log('Invalid file type rejected:', file.mimetype);
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Serve the test HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});

// Create a test endpoint for uploads
app.post('/api/upload/test', upload.single('image'), (req, res) => {
  console.log('Request received at /api/upload/test');
  console.log('Headers:', req.headers);
  
  if (!req.file) {
    console.log('No file received in request');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('File received:', req.file);
  
  res.status(200).json({ 
    message: 'File uploaded successfully',
    file: req.file,
    url: `/uploads/${req.file.filename}`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

// Log startup message
console.log('Test server starting. Use this to test file uploads separately from the main application.');
console.log('Access the test page at http://localhost:5555/'); 