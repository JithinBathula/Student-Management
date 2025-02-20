// controllers/submissionController.js
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';

// Endpoint for a student to submit their work for an assignment
export const submitAssignment = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can submit assignments.' });
  }
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;
    // Ensure the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    // Ensure the student is enrolled in the course associated with the assignment
    const course = await Course.findById(assignment.course);
    if (!course || !course.students.includes(req.user.userId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }
    const submission = new Submission({
      assignment: assignmentId,
      student: req.user.userId,
      content,
    });
    await submission.save();
    res.status(201).json({ message: 'Assignment submitted successfully.', submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting assignment.' });
  }
};
// controllers/submissionController.js

export const gradeSubmission = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can grade submissions.' });
  }
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(submissionId).populate('assignment');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Ensure the teacher owns the course
    const course = await Course.findById(submission.assignment.course);
    if (!course || course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to grade this submission.' });
    }

    // Prevent re-grading if there's already a grade
    if (submission.grade != null) {
      return res.status(400).json({ message: 'Submission is already graded. Cannot re-grade.' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();
    res.json({ message: 'Submission graded successfully.', submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error grading submission.' });
  }
};

// Endpoint for a student to view their submissions
export const getStudentSubmissions = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view their submissions.' });
  }
  try {
    const submissions = await Submission.find({ student: req.user.userId }).populate('assignment');
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching submissions.' });
  }
};

// Endpoint for a teacher to view all submissions for a given assignment
export const getSubmissionsForAssignment = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can view submissions for an assignment.' });
  }
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignment: assignmentId }).populate('student', 'name email');
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching submissions.' });
  }
};

export const getSingleSubmission = async (req, res) => {
  try {
    // teachers or students might want to fetch a single submission
    const submission = await Submission.findById(req.params.submissionId)
      .populate('student', 'name email')
      .populate('assignment');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // If you need role logic, for example:
    // - If teacher, must verify they own the course
    // - If student, must verify it's their submission
    // For now, we assume teacher can fetch any submission for grading:
    // or if (req.user.role === 'student' && submission.student.toString() !== req.user.userId) { ...deny... }

    res.json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching submission.' });
  }
};


export const submitAssignmentWithFile = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can submit assignments.' });
  }
  try {
    const { assignmentId } = req.params;

    // Validate that a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Check if the student already submitted (optional if you want only one submission)
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.userId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted this assignment.' });
    }

    // Check that the assignment and course exist, etc.
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    const course = await Course.findById(assignment.course);
    if (!course || !course.students.includes(req.user.userId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    // Create a new submission with file
    const submission = new Submission({
      assignment: assignmentId,
      student: req.user.userId,
      file: req.file.filename, // store the filename from Multer
    });
    await submission.save();
    res.status(201).json({
      message: 'Assignment submitted successfully (file upload).',
      submission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting assignment with file.' });
  }
};