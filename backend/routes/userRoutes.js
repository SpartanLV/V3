const express = require('express');
const router = express.Router();
const { viewUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const auth = require('../middleware/auth'); // Import the auth middleware

// User profile routes
router.get('/profile', auth, viewUserProfile); // View own profile, protected by auth middleware
router.put('/profile', auth, updateUserProfile); // Update own profile, protected by auth middleware

// Admin route for viewing all users (if needed)
router.get('/users', auth, getUsers); // Optionally protected, depending on your requirements

module.exports = router;
