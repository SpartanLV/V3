const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot'); // Assuming you're saving slots in the database

// Generate slots for the day
const generateSlots = () => {
    const slots = [];
    const facilities = ['Field A', 'Field B', 'Auditorium'];
    const today = new Date();
    today.setHours(8, 0, 0, 0); // Start of day: 8 AM

    // Generate slots for every hour from 8 AM to 8 PM
    for (let hour = 8; hour < 20; hour++) {
        const start = new Date(today);
        start.setHours(hour);
        const end = new Date(today);
        end.setHours(hour + 1);

        facilities.forEach(facility => {
            slots.push({
                facility,
                startTime: new Date(start),
                endTime: new Date(end),
                available: true // Mark as available by default
            });
        });
    }
    return slots;
};

// Route to get available slots
router.get('/available-slots', async (req, res) => {
    try {
        const allSlots = generateSlots(); // Generate today's slots

        // Fetch existing bookings for today
        const existingBookings = await Booking.find({
            startTime: { $gte: new Date().setHours(0, 0, 0, 0) },
            status: { $in: ['pending', 'approved'] }
        });

        // Filter out the slots that are already booked
        const availableSlots = allSlots.filter(slot =>
            !existingBookings.some(booking =>
                booking.facility === slot.facility &&
                new Date(booking.startTime).getTime() === new Date(slot.startTime).getTime()
            )
        );

        res.json(availableSlots); // Return available slots to the frontend
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to book a slot
router.post('/book-slot', async (req, res) => {
    const { userId, slotId } = req.body;

    try {
        // Find the slot by ID
        const slot = await Slot.findById(slotId);

        if (!slot || !slot.available) {
            return res.status(400).json({ message: 'The selected slot is not available.' });
        }

        // Create a new booking
        const booking = new Booking({
            user: userId,
            facility: slot.facility,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: 'pending',  // Initially, set the booking status as 'pending'
        });

        // Save the booking to the database
        await booking.save();

        // Mark the slot as unavailable after booking
        slot.available = false;
        await slot.save();

        res.status(201).json({ message: 'Successfully booked the slot!', booking });
    } catch (err) {
        res.status(500).json({ message: 'Error booking the slot', error: err.message });
    }
});

module.exports = router;
