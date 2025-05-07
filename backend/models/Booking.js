const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facility: {
    type: String,
    required: true,
    enum: ['Field A', 'Field B', 'Auditorium']
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  conflictResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
