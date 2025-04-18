const express = require('express');
const router = express.Router();
const { getUsers, addUser, updateUser, deleteUser } = require('../controllers/userController'); 
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');  // Added course routes
const { generateReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// User routes
router.get('/users', auth, roleCheck('admin'), getUsers);
router.post('/users', auth, roleCheck('admin'), addUser);
router.put('/users/:id', auth, roleCheck('admin'), updateUser);
router.delete('/users/:id', auth, roleCheck('admin'), deleteUser);

// Course routes
router.get('/courses', auth, roleCheck('admin'), getCourses);  // Fetch all courses
router.post('/courses', auth, roleCheck('admin'), createCourse);  // Add new course
router.put('/courses/:id', auth, roleCheck('admin'), updateCourse);  // Update course
router.delete('/courses/:id', auth, roleCheck('admin'), deleteCourse);  // Delete course

// Report routes
router.get('/reports/:type', auth, roleCheck('admin'), generateReport);
router.get('/reports/:type/:format', auth, roleCheck('admin'), generateReport);

module.exports = router;
