const Course = require("../models/Course");

// Get all approved courses
exports.getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ approved: true }).populate("instructor", "name email");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get approved courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.approved) {
      return res.status(400).json({ message: "Course is not approved for enrollment" });
    }

    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in the course",
      course,
    });
  } catch (error) {
    console.error("Enroll in course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.id }).populate(
      "instructor",
      "name email"
    );

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Access course materials
exports.getCourseMaterials = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied: You are not enrolled in this course" });
    }

    res.status(200).json({
      success: true,
      materials: course.content, // Return course materials
    });
  } catch (error) {
    console.error("Get course materials error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a lesson as complete
exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentProgress = course.enrolledStudents.find(
      (enrollment) => enrollment.toString() === req.user.id
    );

    if (!studentProgress) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    // Mark the lesson as complete
    studentProgress.progress.set(lessonId, true);

    // Check if all lessons are complete
    const allLessonsCompleted = course.youtubeVideoIds.every((videoId) =>
      studentProgress.progress.get(videoId)
    );

    if (allLessonsCompleted) {
      course.completedStudents.push({ student: req.user.id, completedAt: new Date() });
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lesson marked as complete",
      progress: studentProgress.progress,
    });
  } catch (error) {
    console.error("Mark lesson complete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get progress for a course
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentProgress = course.enrolledStudents.find(
      (enrollment) => enrollment.toString() === req.user.id
    );

    if (!studentProgress) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    res.status(200).json({
      success: true,
      progress: studentProgress.progress,
    });
  } catch (error) {
    console.error("Get course progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get completed courses
exports.getCompletedCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      "completedStudents.student": req.user.id,
    }).populate("instructor", "name email");

    res.status(200).json({
      success: true,
      completedCourses: courses.map((course) => ({
        id: course._id,
        title: course.title,
        completedAt: course.completedStudents.find(
          (student) => student.student.toString() === req.user.id
        ).completedAt,
      })),
    });
  } catch (error) {
    console.error("Get completed courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};