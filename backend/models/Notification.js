const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // who created it
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // the target user
  message:   { type: String, required: true },
  type:      { type: String, enum: ['info', 'warning', 'alert'], default: 'info' },
  read:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
