const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user.userId
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resolveConflict = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { conflictResolved: true },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Conflict resolution failed' });
  }
};