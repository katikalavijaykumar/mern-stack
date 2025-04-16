import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testAdminLogin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Test 1: Check admin user exists
    const adminUser = await User.findOne({ email: 'mamtabenrji0230204@gmail.com' });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }
    console.log('Admin user found:', {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin
    });

    // Test 2: Verify password
    const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
    if (!isPasswordValid) {
      throw new Error('Password verification failed');
    }
    console.log('Password verification successful');

    // Test 3: Check admin privileges
    if (!adminUser.isAdmin) {
      throw new Error('User does not have admin privileges');
    }
    console.log('Admin privileges verified');

    await mongoose.disconnect();
    console.log('All authentication tests passed');
    return true;
  } catch (error) {
    console.error('Authentication test failed:', error);
    return false;
  }
};

// Run tests
console.log('Running authentication tests...');
testAdminLogin(); 