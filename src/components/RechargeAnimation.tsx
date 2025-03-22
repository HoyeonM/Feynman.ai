import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import gradientAnimation from '../assets/gradient.json';

const RechargeAnimation: React.FC = () => {
  const [chargeLevel, setChargeLevel] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setChargeLevel(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);
          setTimeout(() => navigate('/'), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 animate-fade-in overflow-hidden">
    {/* Background Lottie Animation */}
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Lottie 
        animationData={gradientAnimation} 
        loop 
        autoplay 
        style={{ width: '100%', height: '100%' }} 
      />
    </div>

    {/* Foreground content */}
    <div className="relative z-10 text-center">
      <h1 className="text-3xl font-bold mb-6">See you soon, learner... 👋</h1>
    </div>
  </div>

  );
};

export default RechargeAnimation;
