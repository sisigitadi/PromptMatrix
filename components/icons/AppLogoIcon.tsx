
import React from 'react';

interface AppLogoIconProps extends React.SVGProps<SVGSVGElement> {
  isAiFeatureActive?: boolean; // Renamed from animatedAsAiIndicator
  enableSwayAndGlow?: boolean;
  isLoading?: boolean;
  title?: string;
}

export const AppLogoIcon: React.FC<AppLogoIconProps> = ({ 
  isAiFeatureActive = false, 
  enableSwayAndGlow = false, 
  isLoading = false, 
  title, 
  className: propsClassName, 
  ...props 
}) => {
  
  const baseFillUrl = isAiFeatureActive ? "url(#matrixLogoGradDynamicPurple)" : "url(#matrixLogoGradDynamicTeal)";
  const baseOpacityFill = isAiFeatureActive ? "rgba(168,85,247,0.7)" : "rgba(13,148,136,0.7)";
  const baseStrokeColor = isAiFeatureActive ? "var(--text-purple-400, #a855f7)" : "var(--text-accent, #0F766E)";

  let dynamicAnimationClasses = '';
  if (isLoading && isAiFeatureActive) {
    dynamicAnimationClasses = 'opacity-70 animate-pulse';
  } else if (enableSwayAndGlow && isAiFeatureActive && !isLoading) {
    dynamicAnimationClasses = 'ai-icon-sway-glow-effect';
  }

  const finalClassName = [propsClassName, dynamicAnimationClasses].filter(Boolean).join(' ');

  return (
    <svg 
      viewBox='0 0 32 32' 
      xmlns='http://www.w3.org/2000/svg'
      className={finalClassName}
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
      
      <rect x="6" y="6" width="7" height="7" rx="1" fill={baseFillUrl} />
      <rect x="19" y="6" width="7" height="7" rx="1" fill={baseOpacityFill} />
      <rect x="6" y="19" width="7" height="7" rx="1" fill={baseOpacityFill} />
      <rect x="19" y="19" width="7" height="7" rx="1" fill={baseFillUrl} />
      
      <path d="M13 13 L16 16 L19 13" stroke={baseStrokeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16 V 19" stroke={baseStrokeColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
};
