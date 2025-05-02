const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const {
  getApprovedCourses,
  enrollInCourse,
  getEnrolledCourses,
  getCourseMaterials,
  markLessonComplete,
  getCourseProgress,
  getCompletedCourses,
  checkEnrollment, // Add the new controller function
  approveEnrollment, // Add the approveEnrollment controller function
} = require("../controllers/studentController");
const { isAdmin } = require('../middleware/auth'); // Middleware to check roles


const router = express.Router();

// Browse approved courses (no authentication required)
router.get("/courses", getApprovedCourses);

// Enroll in a course
router.post("/courses/:id/enroll", authMiddleware, authorizeRoles("student"), enrollInCourse);

// Get all enrolled courses
router.get("/courses/enrolled", authMiddleware, authorizeRoles("student"), getEnrolledCourses);

// Access course materials (restricted to enrolled students)
router.get("/courses/:id/materials", authMiddleware, authorizeRoles("student"), getCourseMaterials);

// Mark a lesson as complete
router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
  authMiddleware,
  authorizeRoles("student"),
  markLessonComplete
);

// Get progress for a course
router.get(
  "/courses/:courseId/progress",
  authMiddleware,
  authorizeRoles("student"),
  getCourseProgress
);

// Get completed courses
router.get("/courses/completed", authMiddleware, authorizeRoles("student"), getCompletedCourses);

// Check if a student is enrolled in a course
router.get("/courses/:id/is-enrolled", authMiddleware, authorizeRoles("student"), checkEnrollment);

// Route to approve enrollment
router.put('/courses/:courseId/enrollments/:studentId/approve', isAdmin, approveEnrollment);


module.exports = router;