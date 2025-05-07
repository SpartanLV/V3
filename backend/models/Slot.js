const mongoose = require('mongoose');

// Define the Slot schema
const SlotSchema = new mongoose.Schema({
    facility: {
        type: String,
        required: true,
        enum: ['Field A', 'Field B', 'Auditorium'], // You can modify this list based on your available facilities
    },
    startTime: {
        type: Date,
        required: true, // The start time of the slot
    },
    endTime: {
        type: Date,
        required: true, // The end time of the slot
    },
    available: {
        type: Boolean,
        default: true, // Slots are available by default
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the Slot model based on the schema
module.exports = mongoose.model('Slot', SlotSchema);
