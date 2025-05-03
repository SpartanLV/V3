// Update progress
require

exports.updateProgress = async (req, res) => {
    try {
      const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.courseId });
      if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });
  
      enrollment.progress += req.body.delta;
      if (enrollment.progress > 100) enrollment.progress = 100;
      await enrollment.save();
      res.json({ percent: enrollment.progress });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Get progress
  exports.getProgress = async (req, res) => {
    try {
      const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.courseId });
      if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });
  
      res.json({ percent: enrollment.progress });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  