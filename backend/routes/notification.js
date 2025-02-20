// routes/notification.js
import express from 'express';
import { sendNotification, getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Teacher sends a notification
router.post('/', sendNotification);

// Retrieve notifications for the logged-in user
router.get('/', getNotifications);

// Mark a specific notification as read
router.patch('/:notificationId', markNotificationAsRead);

export default router;
