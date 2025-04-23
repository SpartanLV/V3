const express = require('express');
const router = express.Router();
const { viewUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');  // Assuming you have a middleware to check for admin role

router.get('/test', (req, res) => {
  res.send('✅ userRoutes are working');
});

// Protected routes

// View own profile (accessible by authenticated users only)
router.get('/profile', auth, viewUserProfile);

// Update own profile (accessible by authenticated users only)
router.put('/profile', auth, updateUserProfile);

// Get all users (only accessible to admins)
router.get('/users', auth, roleCheck('admin'), getUsers);

module.exports = router;
