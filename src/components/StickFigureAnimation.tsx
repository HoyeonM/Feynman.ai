
import React from 'react';
import { cn } from '@/lib/utils';

export const StickFigureAnimation = () => {
  return (
    <div className="relative z-10 animate-float">
      <svg 
        width="80" 
        height="120" 
        viewBox="0 0 80 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Head */}
        <circle cx="40" cy="20" r="15" fill="white" stroke="black" strokeWidth="2.5" />
        
        {/* Eyes */}
        <circle cx="34" cy="17" r="2" fill="black" />
        <circle cx="46" cy="17" r="2" fill="black" />
        
        {/* Smile */}
        <path d="M33 25C36.5 30 43.5 30 47 25" stroke="black" strokeWidth="2" strokeLinecap="round" />
        
        {/* Body */}
        <line x1="40" y1="35" x2="40" y2="70" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Arms */}
        <g className="animate-stick-wave origin-[40px_45px]">
          <line x1="40" y1="45" x2="20" y2="55" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <line x1="40" y1="45" x2="60" y2="55" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Legs */}
        <line x1="40" y1="70" x2="25" y2="100" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="70" x2="55" y2="100" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Speech bubble */}
        <g className="animate-pulse-soft">
          <path 
            d="M65 10C65 15.5228 60.5228 20 55 20C55 20 54 25 50 25C52 25 55 20 55 20C49.4772 20 45 15.5228 45 10C45 4.47715 49.4772 0 55 0C60.5228 0 65 4.47715 65 10Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="1.5"
          />
          
          {/* Speech bubble content - exclamation mark */}
          <text x="54" y="13" textAnchor="middle" fontSize="10" fontWeight="bold">!</text>
        </g>
      </svg>
    </div>
  );
};
