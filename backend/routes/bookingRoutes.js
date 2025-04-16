const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.patch('/:id/resolve', bookingController.resolveConflict);

module.exports = router;