// e:\Projects\Ai\PromptMatrix_Local\src\components\AiTextIcon.tsx

import React from 'react';

interface AiTextIconProps {
  isAiFeatureActive: boolean;
  enableSwayAndGlow?: boolean; // Untuk animasi tambahan
  isLoading?: boolean; // Untuk indikator loading
}

export const AiTextIcon: React.FC<AiTextIconProps> = ({
  isAiFeatureActive,
  enableSwayAndGlow = false,
  isLoading = false,
}) => {
  const baseClassName = 'inline-block align-middle text-lg font-bold leading-none';
  let textColorClass = '';
  let textShadowProperty = 'none';
  let animationClass = '';

  if (isLoading) {
    textColorClass = 'text-blue-400'; // Warna saat loading
    animationClass = 'animate-pulse';
  } else if (isAiFeatureActive) {
    textColorClass = 'text-teal-500 dark:text-teal-400'; // Warna aktif
    textShadowProperty = '0 0 8px rgba(0, 255, 255, 0.6), 0 0 12px rgba(0, 255, 255, 0.4)'; // Efek glow
    if (enableSwayAndGlow) {
      animationClass = 'animate-sway-glow'; // Asumsikan Anda memiliki animasi CSS ini
    }
  } else {
    textColorClass = 'text-gray-400 dark:text-gray-600'; // Warna non-aktif/desaturated
  }

  const finalClassName = `${baseClassName} ${textColorClass} ${animationClass}`.trim();

  return (
    <span className={finalClassName} style={{ textShadow: textShadowProperty }}>
      AI ✨
    </span>
  );
};