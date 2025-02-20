// routes/submission.js
import express from 'express';
import {
  submitAssignmentWithFile,
  submitAssignment,
  gradeSubmission,
  getSingleSubmission,
  getStudentSubmissions,
  getSubmissionsForAssignment
} from '../controllers/submissionController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protect all routes below with this middleware
router.use(authenticateToken);

// 1. Student submits text-based assignment
router.post('/:assignmentId', submitAssignment);

// 2. Student submits file-based assignment
router.post('/upload/:assignmentId', upload.single('submissionFile'), submitAssignmentWithFile);

// 3. Teacher grades a submission
router.put('/grade/:submissionId', gradeSubmission);

// 4. Student views their submissions
router.get('/', getStudentSubmissions);

// 5. Teacher views submissions for a specific assignment
router.get('/assignment/:assignmentId', getSubmissionsForAssignment);

// 6. Teacher (or the submission owner) views a single submission
router.get('/:submissionId', getSingleSubmission);

export default router;
