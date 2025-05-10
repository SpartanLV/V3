// backend/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get course progress
router.get('/:courseId', async (req, res) => {
  try {
    // Add null checks using optional chaining
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const progress = await Progress.findOne({
      user: req.user.userId,  // Changed from id to userId
      course: req.params.courseId
    }).populate('course', 'title');

    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress
router.patch('/:courseId', async (req, res) => {
  try {
    // Verify user ID exists
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const progress = await Progress.findOneAndUpdate(
      { 
        user: req.user.userId,  // Changed from id to userId
        course: req.params.courseId 
      },
      { $inc: { completedUnits: 1 } },
      { new: true, upsert: true }
    );

    res.json({
      percent: Math.round(
        (progress.completedUnits / progress.totalUnits) * 100
      )
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;