// routes/course.js
import express from 'express';
import { createCourse, addStudentToCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createCourse);
router.post('/:courseId/add-student', addStudentToCourse);
router.get('/', getCourses);
router.get('/:courseId', getCourseById); // New endpoint for a single course

export default router;
