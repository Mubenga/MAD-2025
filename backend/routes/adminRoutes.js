const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const {
  getAllUsers,
  updateUserRole,
  approveCourse,
  deleteCourse,
} = require("../controllers/adminController");

const router = express.Router();

// Admin-only route to fetch all users
router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);

// Admin-only route to update user roles
router.patch("/users/:id/role", authMiddleware, authorizeRoles("admin"), updateUserRole);

// Admin-only route to approve a course
router.patch("/courses/:id/approve", authMiddleware, authorizeRoles("admin"), approveCourse);

// Admin-only route to delete a course
router.delete("/courses/:id", authMiddleware, authorizeRoles("admin"), deleteCourse);

module.exports = router;