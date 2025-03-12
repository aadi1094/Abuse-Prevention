// Backend/src/middleware/abusePrevention.js
const rateLimit = require("express-rate-limit");

// IP-based rate limiting
const ipRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Allow 3 attempts per hour per IP (for handling genuine errors)
  message: "Too many requests from this IP. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});

// Cookie-based prevention (additional layer)
const cookieCheck = (req, res, next) => {
  if (req.cookies.couponClaimed === "true") {
    return res.status(403).json({ 
      message: "You have already claimed a coupon from this browser. Please try again later." 
    });
  }
  next();
};

// Combined middleware
const couponLimit = [ipRateLimit, cookieCheck];

module.exports = { couponLimit };