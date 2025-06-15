
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const MediumIcon: React.FC<SVGProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" // Using a common 24x24 viewBox
    fill="currentColor"
    strokeWidth={0} // No stroke
    {...props}
  >
    {/* A common simplified Medium logo "M" */}
    <path d="M7.076 6.308c0-1.077.054-1.284.446-1.63C7.94 4.29 8.524 4 10.15 4h3.692c1.625 0 2.21.29 2.627.678.4.346.446.553.446 1.63v11.385c0 1.077-.054 1.284-.446 1.63-.418.388-1.002.677-2.627.677h-3.692c-1.625 0-2.21-.29-2.627-.678-.4-.346-.446-.553-.446-1.63V6.308zM17.915 4.67C17.522 4.29 17.06 4 15.93 4h-.888V20h.889c1.13 0 1.59-.29 1.984-.678.375-.365.375-.52.375-1.64V6.31c0-1.12-.008-1.274-.375-1.64zM6.085 4.67C5.69 4.29 5.23 4 4.098 4H3.21V20h.888c1.13 0 1.59-.29 1.984-.678.375-.365.375-.52.375-1.64V6.31c0-1.12-.007-1.274-.374-1.64z" />
  </svg>
);
