// Backend/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
    ? ['https://your-frontend-domain.vercel.app', 'http://localhost:5173']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Routes
app.use('/api/coupons', couponRoutes);

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});