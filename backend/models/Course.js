const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String, // e.g., "€12.99"
    required: false,
    default: "€0.00",
  },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  reviews: {
    type: Number,
    required: false,
    default: 0,
  },
  youtubeVideoIds: [
    {
      type: String,
      required: true,
    },
  ],
  image: {
    type: String,
    required: false,
    default: function () {
      // Auto-generate YouTube thumbnail URL if not provided
      return `https://img.youtube.com/vi/${this.youtubeVideoIds[0]}/0.jpg`;
    },
  },
  content: {
    type: String, // Course content (e.g., syllabus, materials)
    required: true,
  },
  approved: {
    type: Boolean, // Indicates if the course is approved by an admin
    default: false,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', CourseSchema);