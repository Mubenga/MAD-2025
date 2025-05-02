// src/config/api.js

// Option 1: Localhost for emulator
// export const API_BASE_URL = "http://localhost:5000/api";

// Option 2: Local IP for physical phone (change IP when needed)
//export const API_BASE_URL = "http://192.168.3.147:5000/api"; // update this IP only
export const API_BASE_URL = "http://172.20.21.89:5000/api";

// Option 3 (optional): Auto-switch for development/production
// export const API_BASE_URL = __DEV__
//   ? "http://192.168.0.101:5000/api" // dev (local)
//   : "https://your-production-domain.com/api"; // prod
