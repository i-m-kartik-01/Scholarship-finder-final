import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import scholarshipsRoutes from './routes/scholarships.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// index.js (updated import)
import { seedScholarships } from './controllers/scholarshipController.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  // seedScholarships();
}).catch(err => console.error('MongoDB connection error:', err));
// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', scholarshipsRoutes);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Handle SPA routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});