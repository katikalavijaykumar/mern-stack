import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminUser = {
      username: 'admin',
      email: 'mamtabenrji0230204@gmail.com',
      password: '123123',
      isAdmin: true
    };

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminUser.email });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);

    // Create admin user
    const user = await User.create(adminUser);
    console.log('Admin user created successfully');
    console.log(user);

    process.exit();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin(); 