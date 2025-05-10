const mongoose = require('mongoose');

// Remove the separate materialSchema since you're embedding directly
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  credits: { type: Number, default: 3 },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
<<<<<<< Updated upstream
  materials: [materialSchema], // Assuming materialSchema is defined elsewhere
=======
  materials: [{
    title: { type: String, required: true },
    filename: { type: String, required: true }, // Changed from 'link' to 'filename'
    type: { 
      type: String, 
      enum: ['pdf', 'video', 'link'], 
      default: 'pdf',
      required: true 
    }
  }]
>>>>>>> Stashed changes
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);