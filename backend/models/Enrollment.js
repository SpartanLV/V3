const mongoose = require('mongoose');
const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // 0–100
  grade: { type: String, default: '' }
});
module.exports = mongoose.model('Enrollment', enrollmentSchema);