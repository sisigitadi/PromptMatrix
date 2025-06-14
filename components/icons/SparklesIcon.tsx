
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

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
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.875 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.125 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813-2.846a4.5 4.5 0 00-3.09-3.09L12.75 1.5l-.813 2.846a4.5 4.5 0 00-3.09 3.09L5.625 9l2.846.813a4.5 4.5 0 003.09 3.09L12.75 15l.813-2.846a4.5 4.5 0 003.09-3.09L19.375 9l-2.846-.813a4.5 4.5 0 00-3.09-3.09z"
    />
  </svg>
);