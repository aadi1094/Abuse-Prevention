// Backend/src/middleware/cookieTracker.js

const cookieTracker = (req, res, next) => {
    try {
      // Check if user has a tracking cookie
      const userCookie = req.cookies.couponTracker;
      
      if (userCookie) {
        const cookieData = JSON.parse(userCookie);
        const lastClaimTime = new Date(cookieData.lastClaim);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        if (lastClaimTime > oneHourAgo) {
          const elapsed = Date.now() - lastClaimTime.getTime();
          const remaining = 60 * 60 * 1000 - elapsed;
          
          const minutes = Math.floor(remaining / (60 * 1000));
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
          
          return res.status(429).json({
            success: false,
            message: `Please wait ${minutes}m ${seconds}s before claiming another coupon`,
            waitTime: `${minutes}m ${seconds}s`
          });
        }
      }
      
      // If no cookie or cookie is expired, proceed
      next();
    } catch (error) {
      console.error('Cookie tracking error:', error);
      next(error);
    }
  };
  
  module.exports = cookieTracker;