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
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/coupons', couponRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Coupon API!');
});
// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});