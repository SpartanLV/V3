//server/controllers/ReviewController.js
const Review = require('../models/Review');

exports.submitReview = async (req, res) => {
  try {
    const newReview = new Review({
      user: req.user.id,
      course: req.body.course,
      rating: req.body.rating,
      comment: req.body.comment
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const myReviews = await Review.find({ user: req.user.id });
    res.json(myReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};