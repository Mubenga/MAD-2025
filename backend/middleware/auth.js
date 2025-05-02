// middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure the path to the User model is correct

// Middleware to authenticate the user
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication failed: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and exclude the password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Authentication failed: User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Authentication failed: Token expired" });
    }
    return res.status(401).json({ message: "Authentication failed: Invalid token" });
  }
};

// Middleware to restrict access based on roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  // Check if the user's role is 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next(); // Proceed to the next middleware if the user is an admin
};

module.exports = {
  authMiddleware,
  authorizeRoles,
  isAdmin, // Export the new isAdmin middleware
};
