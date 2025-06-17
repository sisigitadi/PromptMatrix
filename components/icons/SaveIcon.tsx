import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const SaveIcon: React.FC<SVGProps> = (props) => (
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
      d="M16.5 3.75V16.5M16.5 16.5H7.5M16.5 16.5L12 20.25M7.5 3.75H12m0 0V9.75M12 9.75a2.25 2.25 0 01-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h2.25c.621 0 1.125.504 1.125 1.125V9.75z" 
    />
    {/* A more traditional floppy disk icon representation could be:
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 3.75V16.5m0 0L12 20.25m4.5-3.75V3.75m0 0H7.5m9 0h3.375c.621 0 1.125.504 1.125 1.125V16.5c0 .621-.504 1.125-1.125 1.125H16.5m-6-12.75H3.375c-.621 0-1.125.504-1.125 1.125V16.5c0 .621.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125V6.75M10.5 3.75a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h3a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75h-3z" />
    Using a simpler one for now.
    */}
  </svg>
);