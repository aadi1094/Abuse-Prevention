// Frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import CouponClaim from '../components/CouponClaim';
import CountdownTimer from '../components/CountDownTimer';
import Footer from '../components/Footer';
import { getAvailableCoupons, claimCoupon, seedCoupons } from '../api';

function Home() {
  const [couponData, setCouponData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState(0);

  // Check available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getAvailableCoupons();
        setAvailableCoupons(data.count);
      } catch (err) {
        console.error('Error fetching coupon count:', err);
      }
    };
    
    fetchCoupons();
  }, [couponData]);

  // Add initialization effect
  useEffect(() => {
    const initializeCoupons = async () => {
      try {
        await seedCoupons();
        const data = await getAvailableCoupons();
        setAvailableCoupons(data.count);
      } catch (err) {
        console.error('Error initializing coupons:', err);
        setError('Failed to initialize coupons. Please try again later.');
      }
    };
    
    initializeCoupons();
  }, []);

  const handleClaimCoupon = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await claimCoupon();
      
      if (!result.success) {
        setError(result.message);
        if (result.waitTime) {
          setTimeRemaining(result.waitTime);
        }
      } else {
        setCouponData(result.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
        if (err.response.data.waitTime) {
          setTimeRemaining(err.response.data.waitTime);
        }
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">Round-Robin Coupon System</h1>
        <p className="text-lg text-gray-500">Get your unique coupon code below</p>
      </header>
      
      <main className="flex-1 bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="text-center mb-8 py-3 bg-gray-100 rounded-lg">
          <p>Available Coupons: <span className="font-bold text-indigo-600">{availableCoupons}</span></p>
        </div>
        
        {couponData ? (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">You've successfully claimed your coupon:</p>
            <div className="py-3 px-8 bg-indigo-100 rounded-lg border-2 border-indigo-300 my-4">
              <span className="text-xl font-mono font-bold text-indigo-700">{couponData.code}</span>
            </div>
            <p className="text-gray-600 mt-2">This coupon has been reserved for you. Save it now!</p>
            <p className="mt-4 text-sm text-gray-500">
              You can claim another coupon after 1 hour.
            </p>
          </div>
        ) : timeRemaining ? (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Coupon Limit Reached</h2>
            <p className="text-gray-600 mb-2">You've already claimed a coupon recently.</p>
            <p className="text-gray-600 mb-4">You can claim another in:</p>
            <CountdownTimer initialTime={timeRemaining} onComplete={() => setTimeRemaining(null)} />
          </div>
        ) : (
          <CouponClaim 
            onClaim={handleClaimCoupon} 
            loading={loading} 
            error={error} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default Home;