const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses?search=js
router.get('/', async (req, res) => {
  const { search } = req.query;
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' }; // case-insensitive search
  }

  try {
    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
