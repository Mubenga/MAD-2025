const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
} = require("../controllers/instructorController");

const router = express.Router();

// Instructor-only route to create a course
router.post("/courses", authMiddleware, authorizeRoles("instructor"), createCourse);

// Instructor-only route to update a course
router.patch("/courses/:id", authMiddleware, authorizeRoles("instructor"), updateCourse);

// Instructor-only route to delete a course
router.delete("/courses/:id", authMiddleware, authorizeRoles("instructor"), deleteCourse);

// Instructor-only route to fetch their own courses
router.get("/courses", authMiddleware, authorizeRoles("instructor"), getMyCourses);

module.exports = router;