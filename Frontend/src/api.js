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
    const response = await api.post('/api/coupons/claim');
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw error;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      throw new Error('Failed to send request. Please check your connection.');
    }
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