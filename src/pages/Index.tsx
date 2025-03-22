
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

const Index: React.FC = () => {
  // Smooth page entry effect
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />
      <div className="flex-grow flex items-center">
        <HeroSection />
      </div>
    </main>
  );
};

export default Index;
