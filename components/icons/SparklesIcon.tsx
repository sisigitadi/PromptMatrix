
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  // No specific extra props needed for this basic icon
}

export const SparklesIcon: React.FC<SVGProps> = (props) => (
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
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 7.5h.008v.008h-.008V7.5Zm.008 4.5h.008v.008h-.008V12Zm.008 4.5h.008v.008h-.008V16.5Z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="m19.5 9.75.268.056A2.25 2.25 0 0 1 22.5 12.153l.056.268m-4.5-4.5-.268-.056a2.25 2.25 0 0 0-2.629-2.629l-.056-.268m4.5 4.5-4.5-4.5m4.5-4.5.268-.056A2.25 2.25 0 0 1 22.5 4.847l.056.268" 
    />
  </svg>
);
