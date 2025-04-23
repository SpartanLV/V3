const User = require('../models/User');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Get all users (admin access only)
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add a new user (admin access)
  addUser: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update a user (admin or own profile)
  updateUser: async (req, res) => {
    try {
      const userId = req.user.userId; // Get the userId from the token
      // Check if the user is an admin or trying to update their own profile
      if (req.params.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You can only update your own profile or you need admin access' });
      }

      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete a user (admin access)
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // View own profile (only accessible by the authenticated user)
  viewUserProfile: async (req, res) => {
    try {
      const user = await User
        .findById(req.user.userId)
        .select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      // Ensure profilePictureUrl is properly formatted for frontend
      if (user.profilePictureUrl) {
        // Make sure the URL is properly formatted - ensure consistency
        user.profilePictureUrl = user.profilePictureUrl.startsWith('http') 
          ? user.profilePictureUrl 
          : `${req.protocol}://${req.get('host')}${user.profilePictureUrl}`;
      }
      
      res.json(user);
    } catch (err) {
      console.error('viewUserProfile error:', err);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  },

  // Update own profile (only accessible by authenticated user)
  updateUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Update allowed fields
      if (req.body.name) {
        // Validate name
        if (req.body.name.length < 2 || req.body.name.length > 50) {
          return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
        }
        user.name = req.body.name;
      }
      
      // Handle uploaded picture
      if (req.file) {
        // Validate file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(req.file.mimetype)) {
          // Remove uploaded file if invalid type
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG and GIF are allowed.' });
        }
        
        if (req.file.size > maxSize) {
          // Remove uploaded file if too large
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        
        // If user already has a profile picture, delete the old one
        if (user.profilePictureUrl) {
          try {
            const oldFilePath = user.profilePictureUrl.replace(
              `${req.protocol}://${req.get('host')}`, ''
            );
            const fullPath = path.join(__dirname, '..', 'public', oldFilePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          } catch (deleteErr) {
            console.error('Error deleting old profile picture:', deleteErr);
            // Continue with the update even if deletion fails
          }
        }
        
        // Save a URL that your frontend can fetch
        const uploadPath = `/uploads/profile/${req.file.filename}`;
        user.profilePictureUrl = `${req.protocol}://${req.get('host')}${uploadPath}`;
      }

      const updated = await user.save();
      const { password, ...userData } = updated.toObject();
      res.json(userData);

    } catch (err) {
      console.error('updateUserProfile error:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  },
};