const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/enrollmentController');

router.post('/', auth, ctrl.createEnrollment);
router.get('/me', auth, ctrl.getMyEnrollments);
router.put('/:id', auth, ctrl.updateProgress);
router.get('/me/grades', auth, ctrl.getGradesheet);

module.exports = router;