const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  facility: {
    type: String,
    required: true,
    enum: ['Field A', 'Field B', 'Auditorium'],
  },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

// Add compound index to prevent duplicate slots
SlotSchema.index({ facility: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Slot', SlotSchema);