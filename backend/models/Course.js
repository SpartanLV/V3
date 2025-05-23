const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'link'], default: 'pdf', required: true }
  });




const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  credits: { type: Number, default: 3 },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  materials: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true },
      type: { type: String, enum: ['pdf', 'video', 'link'], default: 'pdf' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
