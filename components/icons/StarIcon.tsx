import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export const StarIcon: React.FC<SVGProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor" // Changed fill to currentColor to allow color changes via className
    viewBox="0 0 24 24"
    strokeWidth={1.5} // Adjusted strokeWidth for better visual consistency with other icons if needed
    stroke="currentColor" // Ensures stroke also uses themed color
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.324l5.36-.772a.563.563 0 01.632.62l-1.658 5.247a.563.563 0 00.144.526l4.043 3.513a.563.563 0 01-.327.949l-5.228.468a.563.563 0 00-.404.379l-2.11 5.143a.563.563 0 01-1.028 0l-2.11-5.143a.563.563 0 00-.404-.379l-5.228-.468a.563.563 0 01-.327-.949l4.043-3.513a.563.563 0 00.144-.526L3.25 8.774a.563.563 0 01.632-.62l5.36.772a.563.563 0 00.475-.324l2.125-5.111z"
    />
  </svg>
);