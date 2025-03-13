// Frontend/src/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.vercel.app/api'
    : 'http://localhost:5000/api');

// Create an axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get available coupons
export const getAvailableCoupons = async () => {
  try {
    const response = await api.get('/api/coupons/available');
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

// Claim a coupon
export const claimCoupon = async () => {
  try {
    const response = await api.post('/coupons/claim');  // Remove '/api' since it's in baseURL
    console.log('Coupon claim response:', response.data); // Add logging
    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to claim coupon');
    }
  } catch (error) {
    console.error('Claim error details:', error);
    if (error.response) {
      throw error.response.data;
    }
    throw new Error('Network error: Failed to claim coupon');
  }
};

// Seed coupons (for admin use)
export const seedCoupons = async () => {
  try {
    const response = await api.post('/api/coupons/seed');
    return response.data;
  } catch (error) {
    console.error('Error seeding coupons:', error);
    throw error;
  }
};

// Reset claims (for admin use)
export const resetClaims = async () => {
  try {
    const response = await api.post('/api/coupons/reset');
    return response.data;
  } catch (error) {
    console.error('Error resetting claims:', error);
    throw error;
  }
};

export default api;