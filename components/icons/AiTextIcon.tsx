import React from 'react';

interface AiTextIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  isAiFeatureActive?: boolean;
  enableSwayAndGlow?: boolean;
  isLoading?: boolean;
  title?: string;
}

export const AiTextIcon: React.FC<AiTextIconProps> = ({
  isAiFeatureActive = false,
  enableSwayAndGlow = false,
  isLoading = false,
  title,
  className: propsClassName,
  style: propsStyle, 
  ...props
}) => {
  let dynamicClasses = '';
  let textColorClass = 'text-slate-400 dark:text-slate-500'; 
  let textShadowStyle = '0.5px 0.5px 0.5px rgba(0, 0, 0, 0.2)'; // Softer default shadow for inactive state

  if (isAiFeatureActive) {
    textColorClass = 'text-purple-400 dark:text-purple-300'; 
    // Enhanced 3D effect for active AI, complementing the glow
    textShadowStyle = '1px 1px 0px rgba(88, 28, 135, 0.3), 1.5px 1.5px 0.5px rgba(76, 29, 149, 0.15)'; 
    if (isLoading) {
      dynamicClasses = 'opacity-70 animate-pulse';
    } else if (enableSwayAndGlow) {
      // Use the CSS class defined in index.html for the sway and glow effect
      dynamicClasses = 'ai-icon-sway-glow-effect'; 
    }
  } else {
    // Explicitly ensure subtle shadow for inactive state
    textShadowStyle = '0.5px 0.5px 0.5px rgba(0, 0, 0, 0.2)';
    // No sway/glow animations for inactive state
  }

  const finalClassName = ['font-bold text-sm leading-none inline-block', textColorClass, dynamicClasses, propsClassName].filter(Boolean).join(' ');

  const combinedStyle = {
    ...propsStyle,
    textShadow: textShadowStyle,
    WebkitFontSmoothing: 'antialiased', // Smoother text rendering
    MozOsxFontSmoothing: 'grayscale',
  };

  return (
    <span className={finalClassName} title={title} style={combinedStyle} {...props}>
      <span className="select-none">A</span><span className="select-none" style={{ fontVariantLigatures: 'none' }}>i</span>
    </span>
  );
};
