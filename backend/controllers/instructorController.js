const Course = require("../models/Course");

// Create a course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.create({
      title,
      description,
      content,
      instructor: req.user.id, // Associate the course with the logged-in instructor
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully. Pending admin approval.",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    const course = await Course.findOne({ _id: id, instructor: req.user.id }); // Ensure the course belongs to the instructor

    if (!course) {
      return res.status(404).json({ message: "Course not found or not authorized" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.content = content || course.content;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOneAndDelete({ _id: id, instructor: req.user.id }); // Ensure the course belongs to the instructor

    if (!course) {
      return res.status(404).json({ message: "Course not found or not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all courses created by the instructor
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get my courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};