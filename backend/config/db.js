import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Extract and mask the URI for safe logging
    const uri = process.env.MONGO_URI || '';
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    // Log a safe version of the URI (hide credentials)
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB: ${maskedUri}`);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(uri);
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    console.log(`Connection state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`);
    
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server');
    }
    process.exit(1);
  }
};

export default connectDB;
