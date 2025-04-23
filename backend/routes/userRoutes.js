const express  = require('express');
const path     = require('path');
const multer   = require('multer');
const router   = express.Router();
const auth     = require('../middleware/auth');
const roleCheck= require('../middleware/roleCheck');
const {
  viewUserProfile,
  updateUserProfile,
  getUsers
} = require('../controllers/userController');

// Multer configuration: save in /uploads/profile, prepend timestamp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Test route
router.get('/test', (req, res) => {
  res.send('✅ userRoutes are working');
});

// View own profile
router.get('/profile', auth, viewUserProfile);

// Update own profile, handling the “profilePicture” file field
router.put(
  '/profile',
  auth,
  upload.single('profilePicture'),
  updateUserProfile
);

// Admin: get all users
router.get('/users', auth, roleCheck('admin'), getUsers);

module.exports = router;
