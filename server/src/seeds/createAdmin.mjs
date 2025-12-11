import User from '../models/User.mjs';
import 'dotenv/config';
import {hashPassword} from '../utils/hashPassword.mjs';
import connectDB from '../db/db.mjs';


const createAdmin = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    // Create a new admin user
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: await hashPassword(process.env.ADMIN_PASSWORD),
      role: 'admin',
    });

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }finally {
    process.exit();
  } 

}

// Execute the function
await createAdmin();