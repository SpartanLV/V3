const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const generateSlots = () => {
    const slots = [];
    const facilities = ['Field A', 'Field B', 'Auditorium'];
    const today = new Date();
    today.setHours(8, 0, 0, 0); // Start of day: 8 AM

    for (let hour = 8; hour < 20; hour++) {
        const start = new Date(today);
        start.setHours(hour);
        const end = new Date(today);
        end.setHours(hour + 1);

        facilities.forEach(facility => {
            slots.push({
                facility,
                startTime: new Date(start),
                endTime: new Date(end)
            });
        });
    }
    return slots;
};

router.get('/available-slots', async (req, res) => {
    try {
        const allSlots = generateSlots();

        const existingBookings = await Booking.find({
            startTime: { $gte: new Date().setHours(0, 0, 0, 0) },
            status: { $in: ['pending', 'approved'] }
        });

        const availableSlots = allSlots.filter(slot =>
            !existingBookings.some(booking =>
                booking.facility === slot.facility &&
                new Date(booking.startTime).getTime() === new Date(slot.startTime).getTime()
            )
        );

        res.json(availableSlots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
