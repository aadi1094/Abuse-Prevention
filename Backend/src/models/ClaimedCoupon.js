// Backend/src/models/claimedCoupon.js
const mongoose = require('mongoose');

const claimedCouponSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  couponCode: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClaimedCoupon', claimedCouponSchema);