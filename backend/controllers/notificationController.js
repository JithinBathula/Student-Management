// controllers/notificationController.js
import Notification from '../models/Notification.js';
import Course from '../models/Course.js';

export const sendNotification = async (req, res) => {
  // Only teachers can send notifications.
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can send notifications.' });
  }
  try {
    const { courseId, message } = req.body;
    
    // Verify the course exists and that the teacher owns the course.
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    if (course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to send notifications for this course.' });
    }
    
    // Create notifications for each student in the course.
    const notifications = course.students.map(studentId => ({
      recipient: studentId,
      message,
    }));
    await Notification.insertMany(notifications);
    
    res.json({ message: 'Notifications sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending notifications.' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    // Retrieve notifications for the logged-in user (student).
    const notifications = await Notification.find({ recipient: req.user.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user.userId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating notification.' });
  }
};
