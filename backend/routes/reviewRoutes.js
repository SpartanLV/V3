const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.submitReview);
router.get('/course/:courseId', ctrl.getCourseReviews);
router.get('/me', auth, ctrl.getMyReviews);

module.exports = router;