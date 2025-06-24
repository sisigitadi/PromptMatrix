
import React, { useEffect, useRef } from 'react'; // Moved to components/modals
import { useLanguage } from '../../contexts/LanguageContext';
import { StarIcon } from './icons/StarIcon';
import { AiTextIcon } from './AiTextIcon'; 

interface SubscriptionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyAvailable?: boolean; // Added to show current status if needed
}

const SubscriptionInfoModal: React.FC<SubscriptionInfoModalProps> = ({ isOpen, onClose, apiKeyAvailable }) => {
  const { t, language, setLanguage: setAppLanguage } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) { 
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              event.preventDefault();
            }
          } else { 
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              event.preventDefault();
            }
          }
        }
      };
      
      const currentModalRef = modalRef.current; 
      currentModalRef.addEventListener('keydown', handleTabKeyPress);
      
      return () => {
        currentModalRef?.removeEventListener('keydown', handleTabKeyPress);
      };
    }
  }, [isOpen]);


  if (!isOpen) {
    return null;
  }

  const handleLanguageToggleInModal = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setAppLanguage(newLang);
     // Re-focus the close button after language change for accessibility
    setTimeout(() => closeButtonRef.current?.focus(), 0);
  };


  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-info-title"
      onClick={onClose} 
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-slate-800 via-slate-900 to-black text-[var(--text-primary)] rounded-xl border border-purple-700 shadow-2xl w-full max-w-lg p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
        tabIndex={-1} 
      >
        <div className="flex justify-between items-center pb-3 border-b border-purple-600/50">
          <div className="flex items-center">
            <StarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 mr-2.5 shrink-0" />
            <h2 id="subscription-info-title" className="text-lg sm:text-xl font-semibold text-purple-400">
              {t('subscriptionInfoModalTitle')}
            </h2>
          </div>
           <button
            onClick={handleLanguageToggleInModal}
            className="px-2 py-1 text-xs sm:text-sm font-semibold text-slate-300 hover:text-purple-300 transition-colors rounded-md hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            aria-label={language === 'id' ? t('switchToEnglish') : t('switchToIndonesian')}
          >
            {language === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-4 pr-1 text-sm sm:text-base" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
          <p className="text-slate-300">{t('subscriptionModalIntro')}</p>
          
          <div>
            <h3 className="text-md font-semibold text-teal-400 mb-1.5">{t('subscriptionModalFreeFeaturesTitle')}</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>{t('subscriptionModalFreeFeature1')}</li>
              <li>{t('subscriptionModalFreeFeature2')}</li>
              <li>{t('subscriptionModalFreeFeature3')}</li>
              <li>{t('subscriptionModalFreeFeature4')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-yellow-400 mb-1.5 flex items-center">
              {t('subscriptionModalPremiumFeaturesTitle')}
              <AiTextIcon
                isAiFeatureActive={true} // Always show as premium color in this context
                enableSwayAndGlow={true} 
                className="ml-2" 
              />
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>{t('subscriptionModalPremiumFeature1')}</li>
              <li>{t('subscriptionModalPremiumFeature2')}</li>
              <li>{t('subscriptionModalPremiumFeature3')}</li>
              <li>{t('subscriptionModalPremiumFeature4')}</li>
            </ul>
          </div>
          
          <p className="text-purple-300 italic mt-3">{t('subscriptionModalComingSoon')}</p>
           {apiKeyAvailable !== undefined && ( // Show current status if prop is passed
            <p className={`mt-2 text-xs ${apiKeyAvailable ? 'text-green-400' : 'text-orange-400'}`}>
              {apiKeyAvailable ? t('premiumPlanTooltip') : t('freePlanTooltip')}
            </p>
          )}
        </div>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="mt-5 w-full px-4 py-3 rounded-lg transition-all duration-150 ease-in-out font-semibold text-base sm:text-lg bg-purple-600 hover:bg-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <span className="button-text-content">{t('confirmButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default SubscriptionInfoModal;
