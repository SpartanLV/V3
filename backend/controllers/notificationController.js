const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      userId: req.body.userId,
      message: req.body.message,
      type: req.body.type || 'info'
    });
    await notification.save();
    req.app.get('io').to(`user-${req.body.userId}`).emit('new-notification', notification);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};