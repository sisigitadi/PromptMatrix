
import React from 'react';
import { AppLogoIcon } from './icons/AppLogoIcon'; // Or a generic spinner icon

interface GlobalActivityIndicatorProps {
  activityMessage: string | null;
}

const GlobalActivityIndicator: React.FC<GlobalActivityIndicatorProps> = ({ activityMessage }) => {
  if (!activityMessage) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 bg-slate-700/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-100 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-lg shadow-xl border border-slate-600 dark:border-slate-700 flex items-center space-x-2 global-activity-indicator-animation"
      role="status"
      aria-live="assertive"
      aria-atomic="true"
    >
      <AppLogoIcon 
        animatedAsAiIndicator 
        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 dark:text-purple-300 animate-spin-slow" 
      />
      <span>{activityMessage}</span>
    </div>
  );
};

export default GlobalActivityIndicator;
