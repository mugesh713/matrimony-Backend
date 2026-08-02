import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await Admin.findOne({ email: 'admin@matrimony.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new Admin({
        email: 'admin@matrimony.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super_admin',
        permissions: {
          manageUsers: true,
          manageProfiles: true,
          manageReports: true,
          viewAnalytics: true,
          managePayments: true,
          manageAdmins: true,
        },
      });

      await admin.save();
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();