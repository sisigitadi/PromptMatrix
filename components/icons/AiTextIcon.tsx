
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AiTextIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  isAiFeatureActive?: boolean;
  enableSwayAndGlow?: boolean;
  isLoading?: boolean;
  title?: string; // Allow specific title from parent
}

export const AiTextIcon: React.FC<AiTextIconProps> = ({
  isAiFeatureActive = false,
  enableSwayAndGlow = false,
  isLoading = false,
  title: propTitle,
  className: propsClassName,
  style: propsStyle,
  ...props
}) => {
  const { t } = useLanguage();

  let dynamicClasses = '';
  let textColorClass = 'text-slate-400 dark:text-slate-500'; // Default for non-active AI feature
  let textShadowProperty = '0.5px 0.5px 0.5px rgba(0, 0, 0, 0.2)'; // Changed from textShadowStyle for consistency

  if (isAiFeatureActive) {
    textColorClass = 'text-purple-400 dark:text-purple-300'; // Premium/Active AI
    textShadowProperty = '1px 1px 0px rgba(126, 34, 206, 0.3), 1.5px 1.5px 0.5px rgba(107, 33, 168, 0.15)'; // Purple shadow

    if (isLoading) {
      dynamicClasses = 'opacity-70 animate-pulse';
    } else if (enableSwayAndGlow) {
      dynamicClasses = 'ai-icon-sway-glow-effect';
    }
  } else if (isLoading) {
    // This branch intentionally left to not modify dynamicClasses if isAiFeatureActive is false,
    // matching the behavior of the more complete (but still erroneous) version provided in the prompt.
    // Pulse animation is typically for active AI features that are loading.
  }

  const finalClassName = [
    'font-bold',
    'text-xs', // standard size
    'tracking-tighter',
    'inline-block',
    'leading-none',
    'p-[2px]', // tiny padding for visual balance
    'rounded-sm', // slightly rounded
    textColorClass,
    dynamicClasses,
    propsClassName,
  ].filter(Boolean).join(' ');

  const finalStyle = {
    textShadow: textShadowProperty,
    ...propsStyle,
  };
  
  const actualTitle = propTitle; // Use propTitle directly (could be undefined)

  return (
    <span
      className={finalClassName}
      style={finalStyle}
      title={actualTitle} // Set the title attribute for accessibility
      {...props}
    >
      AI
    </span>
  );
};
