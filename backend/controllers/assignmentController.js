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
      course: courseId, // creates a foreign key to course collection
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
    const assignments = await Assignment.find({ course: courseId }).sort({ createdAt: -1 }); // finds all assignments with same course
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving assignments.' });
  }
};


export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId); // you get the assignment id in the url and then use it to find the assignment
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }
    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching assignment.' });
  }
};