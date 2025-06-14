
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const AppLogoIcon: React.FC<SVGProps> = (props) => (
  <svg 
    viewBox='0 0 32 32' 
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <defs>
      <linearGradient id='matrixLogoGrad' x1='0.5' y1='0' x2='0.5' y2='1'>
        <stop offset='0%' stop-color='#0D9488'/> {/* teal-600 */}
        <stop offset='100%' stop-color='#0F766E'/> {/* teal-700 */}
      </linearGradient>
    </defs>
    {/* Stylized 'M' or Matrix representation */}
    {/* Top left square */}
    <rect x="6" y="6" width="7" height="7" rx="1" fill="url(#matrixLogoGrad)" />
    {/* Top right square */}
    <rect x="19" y="6" width="7" height="7" rx="1" fill="url(#matrixLogoGrad)" />
    {/* Bottom left square */}
    <rect x="6" y="19" width="7" height="7" rx="1" fill="url(#matrixLogoGrad)" />
    {/* Bottom right square */}
    <rect x="19" y="19" width="7" height="7" rx="1" fill="url(#matrixLogoGrad)" />
    {/* Center connecting elements (optional, for M-like feel) */}
    <path d="M13 13 L16 16 L19 13" stroke="url(#matrixLogoGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 16 V 19" stroke="url(#matrixLogoGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);