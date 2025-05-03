// backend/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/enrollmentController');

// POST   /api/enrollments      createEnrollment
// GET    /api/enrollments      getMyEnrollments
// PUT    /api/enrollments/:id  updateProgress
// GET    /api/enrollments/grades  getGradesheet
router.post('/',         auth, ctrl.createEnrollment);
router.get('/',          auth, ctrl.getMyEnrollments);
router.put('/:id',       auth, ctrl.updateProgress);
router.get('/grades',    auth, ctrl.getGradesheet);

module.exports = router;
