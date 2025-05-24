import express from 'express';
import { getScholarships, matchScholarshipsToProfile } from '../controllers/scholarshipController.js';

const router = express.Router();

// Get all scholarships
router.get('/scholarships', getScholarships);

// Match scholarships to student profile
router.post('/match', matchScholarshipsToProfile);

export default router;