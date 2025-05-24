import mongoose from 'mongoose';
import dotenv from 'dotenv';
import scholarshipsData from './data/scholarshipsData.js';
import Scholarship from './models/Scholarship.js';

dotenv.config();

const seedScholarships = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Options removed
    console.log('MongoDB connected ✅');

    await Scholarship.deleteMany();
    await Scholarship.insertMany(scholarshipsData);

    console.log(`✅ Seeded ${scholarshipsData.length} scholarships`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedScholarships();