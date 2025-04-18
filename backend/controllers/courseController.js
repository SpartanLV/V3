const mongoose = require('mongoose'); // Ensure mongoose is required
const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, code, description, credits, faculty } = req.body;

    // Ensure faculty is a valid ObjectId
    const validFacultyId = mongoose.Types.ObjectId(faculty); // Corrected line
    
    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    const course = new Course({ title, code, description, credits, faculty: validFacultyId });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    // Ensure the faculty field is valid if it's being updated
    if (req.body.faculty) {
      req.body.faculty = mongoose.Types.ObjectId(req.body.faculty);
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
