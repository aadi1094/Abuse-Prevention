// Backend/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import routes
const couponRoutes = require('./routes/couponRoutes');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow all origins in production since we're serving frontend
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}));

// Add OPTIONS preflight handler
app.options('*', cors());

// Rate limiting for production
if (process.env.NODE_ENV === 'production') {
  const rateLimit = require('express-rate-limit');
  app.set('trust proxy', 1);
  
  app.use(rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
    message: { 
      error: 'Too many requests from this IP, please try again after an hour'
    }
  }));
}

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  
  // Serve frontend static files from Backend/dist instead of Frontend/dist
  app.use(express.static(path.join(__dirname, './dist')));
  
  // Handle other routes by serving index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  });
}

// Routes
app.use('/api/coupons', couponRoutes);

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});