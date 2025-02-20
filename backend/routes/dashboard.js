// routes/dashboard.js
import express from 'express';
import { getStudentDashboard } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/dashboard - Retrieve the student's dashboard data
router.get('/', getStudentDashboard);

export default router;
