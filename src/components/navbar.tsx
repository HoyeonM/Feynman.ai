import React from 'react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const logOut = async () => {
    // TODO: ADD CODE FOR LOGOUT
    console.log('sign out');
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[7%] shadow-lg bg-white z-50">
      <div className="flex justify-between items-center px-4 py-2 w-full">
        {/* Logo Section */}
        <div className="flex justify-start">
          <img src="/path/to/your/logo.png" alt="Feynman.ai Logo" className="h-8" />
        </div>

        {/* Sign Out Button */}
        <div>
          <Button
            onClick={logOut}
            className="bg-black text-white h-[5%] hover:bg-white hover:text-black border-2 border-black rounded-half"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
