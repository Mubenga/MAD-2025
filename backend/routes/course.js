const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { body, validationResult } = require("express-validator");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Only instructors)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("instructor"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("youtubeVideoIds").isArray().withMessage("YouTube Video IDs should be an array"),
    body("content").notEmpty().withMessage("Course content is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, category, youtubeVideoIds, content } = req.body;

    try {
      const newCourse = new Course({
        title,
        description,
        instructor: req.user._id,
        category,
        youtubeVideoIds,
        content,
        image: `https://img.youtube.com/vi/${youtubeVideoIds[0]}/0.jpg`
      });

      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (err) {
      console.error("Error creating course:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name");
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Only instructor or admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Only instructor or admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
