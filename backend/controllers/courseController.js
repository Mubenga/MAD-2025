const Course = require("../models/Course");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    
    console.log("Request Body:", req.body); // Log the request body

    const { title, description, category, price, youtubeVideoIds, content } = req.body;

    // Ensure all required fields are present
    if (!title || !description || !category || !youtubeVideoIds || !content) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const course = new Course({
      title,
      description,
      instructor: req.user._id, // The logged-in instructor
      category,
      price,
      youtubeVideoIds,
      content,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all approved courses
exports.getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ approved: true }).populate("instructor", "name email");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get approved courses error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};