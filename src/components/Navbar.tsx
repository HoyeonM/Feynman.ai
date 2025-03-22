
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="py-6 w-full animate-fade-in">
      <div className="layout-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-medium transition-opacity hover:opacity-80"
            >
              Feynman.ai ⭐️
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link 
              to="/login" 
              className="btn-secondary py-2 px-4"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="btn-primary py-2 px-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
