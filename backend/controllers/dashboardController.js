// controllers/dashboardController.js
import Submission from '../models/Submission.js';

export const getStudentDashboard = async (req, res) => {
  // Ensure that only students can access this endpoint
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view their dashboard.' });
  }
  try {
    // Retrieve all submissions for the logged-in student,
    // and populate the assignment's title and due date for context
    const submissions = await Submission.find({ student: req.user.userId })
      .populate('assignment', 'title dueDate');

    // Filter submissions that have been graded
    const gradedSubmissions = submissions.filter(sub => typeof sub.grade === 'number');
    const totalGrade = gradedSubmissions.reduce((sum, sub) => sum + sub.grade, 0);
    const averageGrade =
      gradedSubmissions.length > 0 ? totalGrade / gradedSubmissions.length : null;

    res.json({
      submissions,
      summary: {
        totalAssignments: submissions.length,
        gradedAssignments: gradedSubmissions.length,
        averageGrade,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving dashboard data.' });
  }
};
