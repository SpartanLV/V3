// backend/routes/progressRoutes.js
const express = require('express');
const router  = express.Router();
const Progress = require('../models/Progress');

// Get current progress percent
router.get('/:courseId', async (req, res) => {
  const prog = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
  const percent = prog
    ? (prog.completedUnits / prog.totalUnits) * 100
    : 0;
  res.json({ percent });
});

// Update progress (e.g. after video complete, quiz done)
router.patch('/:courseId', async (req, res) => {
  const { delta } = req.body; // e.g. +1 unit
  const prog = await Progress.findOneAndUpdate(
    { user: req.user.id, course: req.params.courseId },
    { $inc: { completedUnits: delta } },
    { new: true, upsert: true }
  );
  res.json({ percent: (prog.completedUnits / prog.totalUnits) * 100 });
});

module.exports = router;
