
import React, { useEffect, useState, useRef } from 'react'; // Moved to components/modals
import { useLanguage } from '../contexts/LanguageContext';
import { AiTextIcon } from './AiTextIcon'; 
import { XCircleIcon } from './icons/XCircleIcon';

interface TeaserPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeaserPopupModal: React.FC<TeaserPopupModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // showAnimated controls the CSS animation classes for fade-in/out
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    let animationTriggerTimer: number | undefined;
    let visibilityDurationTimer: number | undefined;
    let closeProcessTimer: number | undefined;

    if (isOpen) {
      // Delay applying the animation class to ensure transition triggers
      animationTriggerTimer = window.setTimeout(() => {
        setShowAnimated(true);
        // Focus the close button after the modal is potentially visible and animated
        setTimeout(() => closeButtonRef.current?.focus(), 100);
      }, 50); // Small delay (e.g., 50ms)

      // Timer to start hiding the modal (trigger fade-out)
      visibilityDurationTimer = window.setTimeout(() => {
        setShowAnimated(false); // Start fade-out animation
      }, 4500 + 50); // Total visible time before fade-out starts (initial delay + content display time)

      // Timer to call onClose after fade-out animation completes
      closeProcessTimer = window.setTimeout(() => {
        onClose(); // Tell parent to set isOpen to false
      }, 4500 + 50 + 500); // Total time: initial delay + content display time + animation duration

    } else {
      // If isOpen becomes false (e.g., parent closes it, or initial state),
      // ensure animation state is also set to hidden.
      setShowAnimated(false);
    }

    return () => {
      clearTimeout(animationTriggerTimer);
      clearTimeout(visibilityDurationTimer);
      clearTimeout(closeProcessTimer);
    };
  }, [isOpen, onClose]);

  // Determine if the modal should be in the DOM
  // It should be in the DOM if isOpen is true, or if it's currently animating out (showAnimated is true even if isOpen became false)
  if (!isOpen && !showAnimated) {
    return null; // Completely remove from DOM
  }

  return (
    <div
      className={`fixed bottom-5 right-5 z-[250] p-4 sm:p-5 rounded-xl shadow-2xl border transition-all duration-500 ease-in-out transform
                  ${showAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                  bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-800 
                  border-purple-500 text-white max-w-xs sm:max-w-md`} 
      role="alertdialog"
      aria-labelledby="teaser-popup-title"
      aria-describedby="teaser-popup-description"
      tabIndex={-1} 
    >
      <button
        ref={closeButtonRef}
        onClick={onClose} // Direct call to onClose, App.tsx will set isOpen to false
        className="absolute top-2 right-2 p-1 text-purple-200 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
        aria-label={t('cancelButton')} 
      >
        <XCircleIcon className="w-5 h-5" />
      </button>

      <div className="flex items-start space-x-3">
        <AiTextIcon 
          isAiFeatureActive={true} 
          enableSwayAndGlow={true} 
          className="text-2xl shrink-0 mt-0.5" 
        />
        <div>
          <h3 id="teaser-popup-title" className="text-base sm:text-lg font-semibold text-yellow-300 mb-1">
            {t('teaserPopupTitle')}
          </h3>
          <p id="teaser-popup-description" className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            {t('teaserPopupMessage')}
          </p>
        </div>
      </div>
      {/* Progress bar should only animate if the modal is meant to be visibly counting down */}
      {showAnimated && (
        <div className="w-full bg-purple-500/50 h-1 mt-3 rounded-full overflow-hidden">
          <div className="bg-yellow-300 h-1 animate-progress-bar" style={{ animationDuration: '5s' }}></div>
        </div>
      )}
    </div>
  );
};

export default TeaserPopupModal;
