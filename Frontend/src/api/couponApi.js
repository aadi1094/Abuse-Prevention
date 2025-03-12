const BASE_URL = 'http://localhost:5000/api';

export const claimCoupon = async () => {
  const response = await fetch(`${BASE_URL}/coupons/claim`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
};

export const seedCoupons = async () => {
  try {
    const response = await fetch(`${BASE_URL}/coupons/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to seed coupons');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error seeding coupons:', error);
    throw error;
  }
};
