require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const adminRoutes = require("./routes/adminRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const studentRoutes = require("./routes/studentRoutes");




const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS Configuration - Add this section
app.use(cors({
  origin: [
    'http://localhost:8081',       // Expo web
    'http://192.168.3.147:8081',   // Your LAN IP
    'exp://192.168.3.147:19000',   // Expo dev client
    'http://localhost:19006',      // Expo web preview
    'http://localhost:3000',      // Common React dev server
    'http://172.20.24.122', // Add your mobile IP
    'http://172.20.28.97' // Add your mobile IP
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", studentRoutes);

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
