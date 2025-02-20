// controllers/assignmentController.js
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';

export const createAssignment = async (req, res) => {
  // Only teachers can create assignments
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can create assignments.' });
  }
  try {
    const { title, description, courseId, dueDate } = req.body;
    // Verify that the course exists and that the teacher owns the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    if (course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized for this course.' });
    }
    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      dueDate,
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating assignment.' });
  }
};

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving assignments.' });
  }
};


export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching assignment.' });
  }
};