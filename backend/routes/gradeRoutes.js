// backend/routes/gradeRoutes.js
const express = require('express');
const router  = express.Router();
const Progress = require('../models/Progress');
const Grade    = require('../models/Grade');

// Generate & return gradesheet once course complete
router.get('/:courseId', async (req, res) => {
  const prog = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
  if (!prog || prog.completedUnits < prog.totalUnits) {
    return res.status(400).json({ message: 'Course not yet completed' });
  }
  // If grade exists, return it; otherwise compute and save
  let grade = await Grade.findOne({ user: req.user.id, course: req.params.courseId });
  if (!grade) {
    const score = prog.completedUnits / prog.totalUnits * 100; // Example: percentage of completed units
    grade = await Grade.create({ user: req.user.id, course: req.params.courseId, score });
  }
  res.json(grade);
});

module.exports = router;
