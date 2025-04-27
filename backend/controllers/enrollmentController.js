const Enrollment = require('../models/Enrollment');

exports.createEnrollment = async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied' });
    }
  const { course } = req.body;
  try {
    // prevent duplicate
    const exists = await Enrollment.findOne({ user: req.user.id, course });
    if (exists) return res.status(400).json({ msg: 'Already enrolled' });

    const newEnroll = new Enrollment({ user: req.user.id, course });
    await newEnroll.save();
    res.status(201).json(newEnroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const list = await Enrollment.find({ user: req.user.id }).populate('course');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { progress: req.body.progress },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesheet = async (req, res) => {
  try {
    const completed = await Enrollment.find({ user: req.user.id, progress: 100 });
    res.json(completed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};