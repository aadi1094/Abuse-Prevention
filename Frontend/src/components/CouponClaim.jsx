// Frontend/src/components/CouponClaim.jsx
import { useState, useEffect } from 'react';
import { claimCoupon } from '../api';
import CountdownTimer from './CountDownTimer';

const CouponClaim = () => {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);

  const handleClaimCoupon = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await claimCoupon();
      console.log('Claim response:', response); // Add logging
      
      if (response.success) {
        setCoupon(response.data);
        // Store the claim time in localStorage for persistence
        localStorage.setItem('lastClaim', JSON.stringify({
          time: new Date().toISOString(),
          coupon: response.data.code
        }));
      } else {
        throw new Error(response.message || 'Failed to claim coupon');
      }
    } catch (err) {
      console.error('Error in claim handler:', err);
      setError(err.message || 'Failed to claim coupon. Please try again later.');
      if (err.timeRemaining) {
        setWaitTime(err.timeRemaining);
        setShowCountdown(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check for previous claim on component mount
  useEffect(() => {
    const checkPreviousClaim = () => {
      const lastClaimData = localStorage.getItem('lastClaim');
      
      if (lastClaimData) {
        const { time, coupon: claimedCoupon } = JSON.parse(lastClaimData);
        const claimTime = new Date(time);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        if (claimTime > oneHourAgo) {
          // Calculate remaining time
          const remaining = 60 * 60 * 1000 - (Date.now() - claimTime.getTime());
          const minutes = Math.floor(remaining / (60 * 1000));
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
          
          setCoupon({ code: claimedCoupon });
          setWaitTime(`${minutes}m ${seconds}s`);
          setShowCountdown(true);
        }
      }
    };
    
    checkPreviousClaim();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Coupon Claim</h2>
      
      {coupon ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-100 rounded-md">
            <h3 className="text-xl font-semibold text-green-800">Your Coupon:</h3>
            <div className="text-3xl font-bold my-2 p-2 bg-white border-2 border-dashed border-green-500 rounded">
              {coupon.code}
            </div>
            {coupon.discount && (
              <p className="text-green-700">
                {coupon.discount}% discount{coupon.description ? `: ${coupon.description}` : ''}
              </p>
            )}
          </div>
          
          {showCountdown && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2">You can claim another coupon in:</p>
              <CountdownTimer initialTime={waitTime} onComplete={() => setShowCountdown(false)} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          {error ? (
            <div className="mb-4 p-4 bg-red-100 rounded-md text-red-700">
              <p>{error}</p>
              {showCountdown && (
                <div className="mt-2">
                  <p>You can claim again in:</p>
                  <CountdownTimer initialTime={waitTime} onComplete={() => setShowCountdown(false)} />
                </div>
              )}
            </div>
          ) : (
            <p className="mb-4 text-gray-600">Click the button below to claim your coupon.</p>
          )}
          
          <button
            onClick={handleClaimCoupon}
            disabled={loading || showCountdown}
            className={`px-6 py-3 rounded-md text-white font-medium w-full ${
              loading || showCountdown 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
            }`}
          >
            {loading ? 'Claiming...' : 'Claim Your Coupon'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponClaim;