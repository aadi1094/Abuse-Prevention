// Backend/src/middleware/ipTracker.js
const ClaimedCoupon = require('../models/ClaimedCoupon'); // Assuming this model exists

const ipTracker = async (req, res, next) => {
  try {
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Check if this IP has claimed a coupon recently
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentClaim = await ClaimedCoupon.findOne({
      ipAddress: clientIP,
      claimedAt: { $gt: oneHourAgo }
    });

    if (recentClaim) {
      const waitTime = calculateRemainingTime(recentClaim.claimedAt);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitTime} before claiming another coupon`,
        waitTime
      });
    }

    // Add IP to the request object for later use
    req.clientIP = clientIP;
    next();
  } catch (error) {
    console.error('IP tracking error:', error);
    next(error);
  }
};

// Helper function to calculate remaining time
const calculateRemainingTime = (claimTime) => {
  const elapsed = Date.now() - new Date(claimTime).getTime();
  const remaining = 60 * 60 * 1000 - elapsed; // One hour in milliseconds
  
  const minutes = Math.floor(remaining / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
  
  return `${minutes}m ${seconds}s`;
};

module.exports = ipTracker;