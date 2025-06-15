
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const GmailIcon: React.FC<SVGProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    strokeWidth={0} // Ensure no stroke is applied if not intended
    {...props}
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    {/* Optional: Add a subtle M if desired, but envelope is standard
    <path d="M5 14.5V11l3.5 2.5L12 11v3.5L8.5 16H7.3L5 14.5zm14 0V11l-3.5 2.5L12 11v3.5l3.5 2.5h1.2L19 14.5z" opacity="0.6"/>
    */}
  </svg>
);
