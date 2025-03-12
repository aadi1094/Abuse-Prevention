const express = require('express');
const router = express.Router();
const {
  claimCoupon,
  getAvailableCoupons,
  seedCoupons,
  resetCoupons
} = require('../controller/couponController');
const ipTracker = require('../middleware/ipTracker');
const cookieTracker = require('../middleware/cookieTracker');

// Public routes
router.get('/available', getAvailableCoupons);

// Protected routes with abuse prevention
router.post('/claim', [ipTracker, cookieTracker], claimCoupon);

// Admin routes (should be protected in production)
router.post('/seed', seedCoupons);
router.post('/reset', resetCoupons);

module.exports = router;