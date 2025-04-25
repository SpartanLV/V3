const Notification = require('../models/Notification');
const User         = require('../models/User');

exports.createNotification = async (req, res) => {
  const io = req.app.get('io');
  const { role, userId, message, type = 'info' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  // 1) Build list of recipient IDs
  let targetUsers;
  if (role) {
    const users = await User.find({ role }).select('_id');
    targetUsers = users.map(u => u._id);
  } else if (userId) {
    targetUsers = [userId];
  } else {
    const users = await User.find().select('_id');
    targetUsers = users.map(u => u._id);
  }

  // 2) Create one Notification per recipient
  const created = [];
  for (const recipient of targetUsers) {
    const notif = await Notification.create({
      sender:    req.user.id,
      recipient,
      message,
      type
    });
    created.push(notif);
    io.to(`user-${recipient}`).emit('new-notification', notif);
  }

  res.status(201).json(created);
};

exports.getUserNotifications = async (req, res) => {
  try {
    // only your notifications
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ count: notifications.length, notifications });
  } catch (err) {
    console.error('getUserNotifications error:', err);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    // ownership check
    if (notif.recipient.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not your notification' });
    }
    notif.read = true;
    await notif.save();
    res.json({ success: true, notification: notif });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
