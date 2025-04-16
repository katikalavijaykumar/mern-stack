import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createTestAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing test admin if exists
    await User.deleteOne({ email: 'test@admin.com' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    const adminUser = new User({
      username: 'testadmin',
      email: 'test@admin.com',
      password: hashedPassword,
      isAdmin: true
    });

    await adminUser.save();
    console.log('Test admin user created:', {
      username: adminUser.username,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

createTestAdmin(); 