const Booking = require('../models/Booking');

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email') // Assuming User model contains 'name' and 'email'
      .exec();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Cancel a booking (update status to cancelled)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' }, // Change status to 'cancelled'
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resolve a booking conflict (set conflictResolved to true)
exports.resolveBookingConflict = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Resolve the conflict
    booking.conflictResolved = true;
    await booking.save();

    res.json({ message: 'Booking conflict resolved', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
