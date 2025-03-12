// Frontend/src/components/CountDownTimer.jsx
import { useState, useEffect } from 'react';

const CountdownTimer = ({ initialTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  // Parse the initial time string (format: "30m 45s")
  useEffect(() => {
    if (initialTime) {
      const parseTime = (timeStr) => {
        let totalSeconds = 0;
        
        // Extract minutes
        const minutesMatch = timeStr.match(/(\d+)m/);
        if (minutesMatch) {
          totalSeconds += parseInt(minutesMatch[1]) * 60;
        }
        
        // Extract seconds
        const secondsMatch = timeStr.match(/(\d+)s/);
        if (secondsMatch) {
          totalSeconds += parseInt(secondsMatch[1]);
        }
        
        return totalSeconds;
      };
      
      const seconds = parseTime(initialTime);
      startCountdown(seconds);
    }
  }, [initialTime]);
  
  const startCountdown = (totalSeconds) => {
    let secondsRemaining = totalSeconds;
    
    const timer = setInterval(() => {
      secondsRemaining -= 1;
      
      if (secondsRemaining <= 0) {
        clearInterval(timer);
        setTimeLeft('00:00');
        if (onComplete) onComplete();
      } else {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    
    // Initial display
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    
    // Cleanup on unmount
    return () => clearInterval(timer);
  };
  
  return (
    <div className="text-2xl font-bold text-center p-2 bg-gray-100 rounded-md">
      {timeLeft}
    </div>
  );
};

export default CountdownTimer;