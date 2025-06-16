
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AppLogoIcon } from './icons/AppLogoIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface TeaserPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeaserPopupModal: React.FC<TeaserPopupModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [isVisibleInternal, setIsVisibleInternal] = useState(isOpen);

  useEffect(() => {
    setIsVisibleInternal(isOpen);
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsVisibleInternal(false); // Start fade out
        setTimeout(onClose, 500); // Fully close after fade out animation
      }, 4500); // Changed from 14500 to 4500 for a 5-second total display
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !isVisibleInternal) { // Only render null if fully closed and faded
    return null;
  }

  return (
    <div
      className={`fixed bottom-5 right-5 z-[250] p-4 sm:p-5 rounded-xl shadow-2xl border transition-all duration-500 ease-in-out transform
                  ${isVisibleInternal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                  bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-800 
                  border-purple-500 text-white max-w-sm sm:max-w-md`}
      role="alertdialog"
      aria-labelledby="teaser-popup-title"
      aria-describedby="teaser-popup-description"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-purple-200 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
        aria-label={t('cancelButton')} // Using a generic close label
      >
        <XCircleIcon className="w-5 h-5" />
      </button>

      <div className="flex items-start space-x-3">
        <AppLogoIcon animatedAsAiIndicator className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300 shrink-0 mt-1" />
        <div>
          <h3 id="teaser-popup-title" className="text-base sm:text-lg font-semibold text-yellow-300 mb-1">
            {t('teaserPopupTitle')}
          </h3>
          <p id="teaser-popup-description" className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            {t('teaserPopupMessage')}
          </p>
        </div>
      </div>
      <div className="w-full bg-purple-500/50 h-1 mt-3 rounded-full overflow-hidden">
        <div className="bg-yellow-300 h-1 animate-progress-bar" style={{ animationDuration: '5s' }}></div> {/* Adjusted animation duration for progress bar */}
      </div>
    </div>
  );
};

export default TeaserPopupModal;