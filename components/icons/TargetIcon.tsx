
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const TargetIcon: React.FC<SVGProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    // className attribute is intended to be passed as a prop from where it's used.
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0-7.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm0 15a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm-7.5-7.5a.75.75 0 01.75.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm15 0a.75.75 0 01.75.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" 
    />
  </svg>
);