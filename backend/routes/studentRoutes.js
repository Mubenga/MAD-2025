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
} = require("../controllers/studentController");

const router = express.Router();

// Browse approved courses
router.get("/courses", authMiddleware, authorizeRoles("student"), getApprovedCourses);

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

module.exports = router;