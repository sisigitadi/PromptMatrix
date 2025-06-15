
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  animatedAsAiIndicator?: boolean; 
  title?: string; 
}

export const AppLogoIcon: React.FC<SVGProps> = ({ animatedAsAiIndicator = false, title, ...props }) => (
  <svg 
    viewBox='0 0 32 32' 
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    {title && <title>{title}</title>} 
    <defs>
      <linearGradient id='matrixLogoGradDynamicTeal' x1='0.5' y1='0' x2='0.5' y2='1'>
        <stop offset='0%' stop-color='var(--text-accent-hover, #0D9488)'/> {/* teal-600 */}
        <stop offset='100%' stop-color='var(--text-accent, #0F766E)'/> {/* teal-700 */}
      </linearGradient>
      <linearGradient id='matrixLogoGradDynamicPurple' x1='0.5' y1='0' x2='0.5' y2='1'>
        <stop offset='0%' stop-color='var(--text-purple-300, #c084fc)'/>
        <stop offset='100%' stop-color='var(--text-purple-400, #a855f7)'/>
      </linearGradient>
    </defs>
    
    <rect x="6" y="6" width="7" height="7" rx="1" fill={animatedAsAiIndicator ? "url(#matrixLogoGradDynamicPurple)" : "url(#matrixLogoGradDynamicTeal)"} />
    <rect x="19" y="6" width="7" height="7" rx="1" fill={animatedAsAiIndicator ? "rgba(168,85,247,0.7)" : "rgba(13,148,136,0.7)"} /> {/* Adjusted opacity color */}
    <rect x="6" y="19" width="7" height="7" rx="1" fill={animatedAsAiIndicator ? "rgba(168,85,247,0.7)" : "rgba(13,148,136,0.7)"} /> {/* Adjusted opacity color */}
    <rect x="19" y="19" width="7" height="7" rx="1" fill={animatedAsAiIndicator ? "url(#matrixLogoGradDynamicPurple)" : "url(#matrixLogoGradDynamicTeal)"} />
    
    <path d="M13 13 L16 16 L19 13" stroke={animatedAsAiIndicator ? "var(--text-purple-400, #a855f7)" : "var(--text-accent, #0F766E)"} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 16 V 19" stroke={animatedAsAiIndicator ? "var(--text-purple-400, #a855f7)" : "var(--text-accent, #0F766E)"} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);
