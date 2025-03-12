const Coupon = require("../models/Coupon");
const ClaimedCoupon = require("../models/ClaimedCoupon");

// Round-robin coupon distribution
const claimCoupon = async (req, res) => {
  const userIP = req.ip;
  const userAgent = req.headers['user-agent'];
  const fingerprint = `${userIP}-${userAgent}`;

  try {
    // Check if user has claimed a coupon recently (via database)
    const recentClaim = await ClaimedCoupon.findOne({
      fingerprint: fingerprint,
      claimedAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) } // Within last hour
    });

    if (recentClaim) {
      const timeRemaining = calculateTimeRemaining(recentClaim.claimedAt);
      return res.status(403).json({ 
        message: "You've already claimed a coupon recently.",
        timeRemaining
      });
    }

    // Get the next available coupon in sequence (round-robin distribution)
    const coupon = await Coupon.findOneAndUpdate(
      { isActive: true },  // Changed from assigned: false
      { isActive: false }, // Changed from assigned: true
      { new: true, sort: { _id: 1 } } // Sort by _id to ensure sequential distribution
    );

    if (!coupon) {
      return res.status(404).json({ message: "No coupons available at this time." });
    }

    // Record this claim to prevent abuse
    await new ClaimedCoupon({
      couponId: coupon._id,
      couponCode: coupon.code, // Add the coupon code
      ipAddress: userIP,      // Changed from ip to ipAddress
      userAgent: userAgent,
      claimedAt: new Date()
    }).save();

    // Set cookie to track claim (additional layer of protection)
    res.cookie("couponClaimed", "true", { 
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      sameSite: 'strict'
    });

    res.json({ 
      success: true,
      message: "Coupon claimed successfully!", 
      data: {             // Changed to match frontend expectations
        code: coupon.code,
        discount: coupon.discount,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error("Coupon claim error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
};

// Get available coupon count (for frontend display)
const getAvailableCoupons = async (req, res) => {
  try {
    const count = await Coupon.countDocuments({ isActive: true });  // Changed from assigned: false
    res.json({ 
      success: true,
      count,
      message: count > 0 ? 'Coupons available' : 'No coupons available'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

// Function to calculate time remaining for the user
const calculateTimeRemaining = (claimTime) => {
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  const elapsedTime = Date.now() - new Date(claimTime).getTime();
  const remainingTime = oneHour - elapsedTime;
  
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);
  
  return { minutes, seconds, milliseconds: remainingTime };
};

// Seed database with coupons (for testing)
const seedCoupons = async (req, res) => {
  try {
    const existingCount = await Coupon.countDocuments();
    
    if (existingCount > 0) {
      await Coupon.updateMany({}, { isActive: true }); // Reset existing coupons
      return res.json({
        success: true,
        message: 'Existing coupons reset'
      });
    }
    
    const couponData = Array.from({ length: 20 }, (_, i) => ({
      code: `COUPON${(i + 1).toString().padStart(3, '0')}`,
      discount: 10 + (i % 5) * 10,
      description: `${10 + (i % 5) * 10}% off your order`,
      isActive: true
    }));
    
    await Coupon.insertMany(couponData);
    
    res.status(201).json({
      success: true,
      message: 'Coupons seeded successfully',
      count: couponData.length
    });
  } catch (error) {
    console.error('Error seeding coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Reset all coupons (for testing)
const resetCoupons = async (req, res) => {
  try {
    await ClaimedCoupon.deleteMany({});
    await Coupon.updateMany({}, { isActive: true });
    
    res.status(200).json({
      success: true,
      message: 'All coupons have been reset'
    });
  } catch (error) {
    console.error('Error resetting coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Single export statement
module.exports = { 
  claimCoupon, 
  getAvailableCoupons,
  seedCoupons,
  resetCoupons
};