const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// GET all courses (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('faculty', 'name email')
      .select('-materials -__v')
      .lean();

    const response = courses.map(course => ({
      ...course,
      materialCount: course.materials ? course.materials.length : 0
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// GET single course content with materials
router.get('/:id/content', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('faculty', 'name email')
      .lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add full URLs for materials
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    if (course.materials && course.materials.length > 0) {
      course.materials = course.materials.map(material => ({
        ...material,
        url: `${baseUrl}/uploads/${material.filename}`
      }));
    } else {
      // Temporary test materials (remove after implementing upload)
      course.materials = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Introduction to the Course',
          type: 'pdf',
          filename: 'intro.pdf',
          url: `${baseUrl}/uploads/intro.pdf`
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Sample Lecture Video',
          type: 'video',
          filename: 'lecture-sample.mp4',
          url: `${baseUrl}/uploads/lecture-sample.mp4`
        }
      ];
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;