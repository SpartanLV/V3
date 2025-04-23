const User = require('../models/User');

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
      console.log("🔍 User profile route hit");
      const userId = req.user.userId; // Get the authenticated user's ID from the token
      const user = await User.findById(userId).select('-password'); // Exclude password field
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  },

  // Update own profile (only accessible by authenticated user)
  updateUserProfile: async (req, res) => {
    const { name, email } = req.body; // Assuming the request body has name and email fields
    const userId = req.user.userId; // Get the authenticated user's ID from the token

    try {
      // Only allow updating the profile of the authenticated user
      const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
};
