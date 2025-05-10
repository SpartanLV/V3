const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const authMiddleware = require('../middleware/auth');

// Generate slots for the next 7 days (run as cron job)
const generateSlots = async () => {
  const facilities = ['Field A', 'Field B', 'Auditorium'];
  const daysToGenerate = 7;
  
  for (let day = 0; day < daysToGenerate; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(0, 0, 0, 0);

    for (let hour = 8; hour < 20; hour++) {
      const start = new Date(date);
      start.setHours(hour);
      const end = new Date(date);
      end.setHours(hour + 1);

      for (const facility of facilities) {
        await Slot.findOneAndUpdate(
          { facility, startTime: start },
          { $setOnInsert: { endTime: end, available: true } },
          { upsert: true }
        );
      }
    }
  }
};

// Get available slots
router.get('/available-slots', async (req, res) => {
  try {
    // Generate slots first
    await generateSlots();
    
    const now = new Date();
    const slots = await Slot.find({
      startTime: { $gte: now },
      available: true
    }).sort('startTime');

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book a slot
router.post('/book-slot', authMiddleware, async (req, res) => {
  try {
    const { slotId } = req.body;
    
    // Validate slot
    const slot = await Slot.findById(slotId);
    if (!slot || !slot.available) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    // Check existing booking
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      startTime: { $gte: new Date() }
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: 'You already have an upcoming booking' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      facility: slot.facility,
      startTime: slot.startTime,
      endTime: slot.endTime
    });

    // Update slot availability
    slot.available = false;
    
    await Promise.all([booking.save(), slot.save()]);
    
    res.json({ 
      message: 'Booking successful!',
      booking,
      slot
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add cancellation endpoint
router.post('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { 
        _id: req.params.id,
        user: req.user.id,
        startTime: { $gt: new Date() }
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
    }

    // Mark slot as available
    await Slot.findOneAndUpdate(
      {
        facility: booking.facility,
        startTime: booking.startTime
      },
      { available: true }
    );

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;