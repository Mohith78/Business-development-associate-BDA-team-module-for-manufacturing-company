import express from 'express';
import { getActivities, getDashboard } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/activities', protect, getActivities);

export default router;
