// backend/routes/reviewRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/reviewController');

// POST   /api/reviews           submitReview
// GET    /api/reviews/course/:courseId  getCourseReviews
// GET    /api/reviews/me        getMyReviews
router.post('/',              auth, ctrl.submitReview);
router.get('/course/:courseId', /* you can opt to protect this too: auth, */ ctrl.getCourseReviews);
router.get('/me',             auth, ctrl.getMyReviews);

module.exports = router;
