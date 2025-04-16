import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

/**
 * Utility function to debug MongoDB connection and check collection status
 */
export const checkDatabaseConnection = async () => {
  try {
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    console.log('\n=== MongoDB Connection Check ===');
    console.log(`Connection state: ${stateMap[connectionState] || 'unknown'}`);
    
    if (connectionState !== 1) {
      console.error('MongoDB is not connected! Cannot proceed with collection checks.');
      return {
        connected: false,
        state: stateMap[connectionState],
        collections: []
      };
    }
    
    // Get database info
    const db = mongoose.connection.db;
    console.log(`Connected to database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\nCollections in database (${collections.length}):`);
    collections.forEach(coll => {
      console.log(` - ${coll.name}`);
    });
    
    // Check counts in main collections
    const productCount = await Product.countDocuments();
    console.log(`\nProducts collection: ${productCount} documents`);
    
    const userCount = await User.countDocuments();
    console.log(`Users collection: ${userCount} documents`);
    
    return {
      connected: true,
      state: stateMap[connectionState],
      collections: collections.map(c => c.name),
      counts: {
        products: productCount,
        users: userCount
      }
    };
  } catch (error) {
    console.error('Error checking database connection:', error);
    return {
      connected: false,
      error: error.message
    };
  }
};

/**
 * Express route handler to check database status
 */
export const dbStatusHandler = async (req, res) => {
  try {
    const status = await checkDatabaseConnection();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
}; 