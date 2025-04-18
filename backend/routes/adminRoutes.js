const express = require('express');
const router = express.Router();

const { getUsers, addUser, updateUser, deleteUser } = require('../controllers/userController'); 
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const { generateReport } = require('../controllers/reportController');
const { getBookings, cancelBooking, resolveBookingConflict } = require('../controllers/bookingController'); // Added booking controller functions

// User routes
router.get('/users', getUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Course routes
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Booking routes integrated into adminRoutes
router.get('/bookings', getBookings);  // Get all bookings
router.put('/bookings/:id/cancel', cancelBooking);  // Cancel a booking (PUT)
router.put('/bookings/:id/resolve', resolveBookingConflict);  // Resolve booking conflict (PUT)

// Report routes
router.get('/reports/:type', generateReport);
router.get('/reports/:type/:format', generateReport);

module.exports = router;
