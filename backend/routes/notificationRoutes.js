
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import { isAuth, isAdmin } from '../utils.js';

const notificationRouter = express.Router();


notificationRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let notifications;

    if (req.user.isAdmin) {
      // Admin gets all notifications
      notifications = await Notification.find().sort({ createdAt: -1 });
    } else {
      // Non-admin users get notifications specific to their type
      notifications = await Notification.find({
        $or: [
          { recipientType: 'admin' },
          { recipientType: req.user.type }, // For users and service providers
        ],
      }).sort({ createdAt: -1 });
    }

    res.json(notifications);
  })
);


// Mark notification as read
notificationRouter.put(
  '/:id/read',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404).send({ message: 'Notification not found' });
    }
  })
);

// Create a new notification (admin access only)
notificationRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { title, message, type, recipientType } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      recipientType,  // Should be 'admin', 'user', or 'serviceProvider'
    });

    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
  })
);


// Delete a notification (admin access only)
notificationRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).send({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.status(200).send({ message: 'Notification deleted successfully' });
  })
);

export default notificationRouter;