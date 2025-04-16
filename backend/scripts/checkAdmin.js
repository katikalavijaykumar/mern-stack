import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'mamtabenrji0230204@gmail.com' });
    
    if (adminUser) {
      console.log('Admin user found:', {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin
      });
    } else {
      console.log('Admin user not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkAdmin(); 