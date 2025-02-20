// routes/assignment.js
import express from 'express';
import { createAssignment, getAssignmentsByCourse, getAssignmentById } from '../controllers/assignmentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createAssignment);
router.get('/course/:courseId', getAssignmentsByCourse);
router.get('/:assignmentId', getAssignmentById);

export default router;
