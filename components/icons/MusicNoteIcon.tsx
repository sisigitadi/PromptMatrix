
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const MusicNoteIcon: React.FC<SVGProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 9V4.5M9 9c0 .796.184 1.556.526 2.228M9 9h4.5M13.5 9V4.5m0 4.5c0 .796-.184 1.556-.526 2.228m0 0A2.25 2.25 0 0113.5 18v.75a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V18.75m0 0A2.25 2.25 0 009 16.5h1.5m0 0V9" 
    />
  </svg>
);