const Course = require("../models/Course");
const { body, validationResult } = require("express-validator");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

// Get all approved courses
const getApprovedCourses = async (req, res) => {
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

// Get all courses (temporarily bypassing the 'approved' filter)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enroll in a course
const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.approved) {
      return res.status(400).json({ message: "Course is not approved for enrollment" });
    }

    const isAlreadyEnrolled = course.enrolledStudents.some(
      (student) => student.student.toString() === req.user.id
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    course.enrolledStudents.push({ student: req.user.id, status: "Pending" });
    await course.save();

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in the course. Status: Pending",
      course,
    });
  } catch (error) {
    console.error("Enroll in course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      "enrolledStudents.student": req.user.id,
    }).populate("instructor", "name email");

    const enrolledCourses = courses.map((course) => {
      const enrollment = course.enrolledStudents.find(
        (student) => student.student.toString() === req.user.id
      );
      return {
        id: course._id,
        title: course.title,
        instructor: course.instructor.name,
        category: course.category,
        price: course.price,
        status: enrollment.status,
      };
    });

    res.status(200).json({
      success: true,
      courses: enrolledCourses,
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Access course materials
const getCourseMaterials = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = course.enrolledStudents.some(
      (student) => student.student.toString() === req.user.id
    );
    if (!isEnrolled) {
      return res.status(403).json({ message: "Access denied: You are not enrolled in this course" });
    }

    res.status(200).json({
      success: true,
      materials: course.content,
    });
  } catch (error) {
    console.error("Get course materials error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a lesson as complete
const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentProgress = course.enrolledStudents.find(
      (enrollment) => enrollment.student.toString() === req.user.id
    );

    if (!studentProgress) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    if (!studentProgress.progress) {
      studentProgress.progress = new Map();
    }

    studentProgress.progress.set(lessonId, true);

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
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentProgress = course.enrolledStudents.find(
      (enrollment) => enrollment.student.toString() === req.user.id
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
const getCompletedCourses = async (req, res) => {
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

// Check if a student is enrolled in a course
const checkEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = course.enrolledStudents.some(
      (student) => student.student.toString() === req.user.id
    );

    res.status(200).json({
      success: true,
      enrolled: isEnrolled,
    });
  } catch (error) {
    console.error("Check enrollment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve a student's enrollment in a course
const approveEnrollment = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = course.enrolledStudents.find(
      (student) => student.student.toString() === studentId
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollment.status = "Approved";
    await course.save();

    res.status(200).json({
      success: true,
      message: "Enrollment approved successfully",
    });
  } catch (error) {
    console.error("Approve enrollment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all controller functions
module.exports = {
  getApprovedCourses,
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
  getCourseMaterials,
  markLessonComplete,
  getCourseProgress,
  getCompletedCourses,
  checkEnrollment,
  approveEnrollment,
};
