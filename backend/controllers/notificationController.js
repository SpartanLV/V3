// controllers/notificationController.js

const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('getUserNotifications error:', err);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

exports.createNotification = async (req, res) => {
  const io = req.app.get('io');
  const { userId, role, message, type = 'info' } = req.body;

  try {
    // 1) Determine target user IDs
    let targetUsers = [];

    if (role) {
      // by role
      const users = await User.find({ role }).select('_id');
      targetUsers = users.map(u => u._id.toString());
    } else if (userId) {
      // single user
      targetUsers = [userId];
    } else {
      // broadcast to all users
      const users = await User.find({}).select('_id');
      targetUsers = users.map(u => u._id.toString());
    }

    // 2) Create & emit one notification per target
    const created = [];
    for (const uid of targetUsers) {
      const notif = new Notification({ userId: uid, message, type });
      await notif.save();
      created.push(notif);
      // emit to that user's room
      io.to(`user-${uid}`).emit('new-notification', notif);
    }

    // 3) Return the array of notifications
    res.status(201).json(created);
  } catch (err) {
    console.error('createNotification error:', err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
