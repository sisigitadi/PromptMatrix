
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const ChartBarIcon: React.FC<SVGProps> = (props) => (
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
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A2.625 2.625 0 013 18.375v-5.25zM6.375 12V4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V12m0 3.75V12m0-10.125C9.75 2.004 10.254 1.5 10.875 1.5h2.25c.621 0 1.125.504 1.125 1.125V12m0 9.75V12M15 9.75V4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V12M18 19.5V12" 
    />
  </svg>
);
