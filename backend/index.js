// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import { dbStatusHandler } from "./utils/dbDebug.js";

// Load environment variables first
dotenv.config();
const port = process.env.PORT || 5000;

// Setup directories and paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at:', uploadsDir);
}

// Create Express app
const app = express();

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route (place before other routes)
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working',
    mongodbUri: process.env.MONGO_URI ? 'MongoDB URI is defined' : 'MongoDB URI is missing',
    uploadsDirectory: uploadsDir
  });
});

// Database status check route
app.get('/api/db-status', dbStatusHandler);

// API Routes (define before static file middleware)
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/images", imageRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Static file serving (after API routes)
console.log('Serving uploads from directory:', uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB 👍");
    
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
      console.log(`Test API: http://localhost:${port}/test`);
      console.log(`Uploads directory: ${uploadsDir}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
