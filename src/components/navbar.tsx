import React, { useState } from 'react';
import { StrictMode } from 'react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-[7%] shadow-lg">
  <div className="flex justify-between items-center px-4 py-2 w-full">
    {/* Logo Section */}
    <div className="flex justify-start">
      <img src="/path/to/your/logo.png" alt="Feynman.ai Logo" className="h-8" />
    </div>

    <div>
      <Button className="bg-black text-white hover:bg-white-200 hover:text-black">Sign Out</Button>
    </div>
  </div>
</div>

  );
};

