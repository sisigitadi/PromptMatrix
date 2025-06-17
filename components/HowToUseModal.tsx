
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { WorkflowDiagramIcon } from './icons/WorkflowDiagramIcon';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isShownAutomatically?: boolean;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose, isShownAutomatically = false }) => {
  const { t, language, setLanguage: setAppLanguage } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const acknowledgeButtonRef = useRef<HTMLButtonElement>(null); // Renamed from closeButtonRef for consistency

  const [countdown, setCountdown] = useState(5);
  const [isCountdownActive, setIsCountdownActive] = useState(isShownAutomatically); // Initialize based on prop
  const intervalRef = useRef<number | null>(null);

  const startCountdown = () => {
    setIsCountdownActive(true);
    setCountdown(5);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsCountdownActive(false);
          setTimeout(() => acknowledgeButtonRef.current?.focus(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && isShownAutomatically) {
      startCountdown();
    } else if (isOpen && !isShownAutomatically) {
      setIsCountdownActive(false);
      setCountdown(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => acknowledgeButtonRef.current?.focus(), 100);
    } else { // When closed
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Reset for next potential automatic show, only if it *was* an automatic show
      if(isShownAutomatically) {
        setIsCountdownActive(true);
        setCountdown(5);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, isShownAutomatically, language]);


  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isShownAutomatically) { // If opened manually, allow Escape to close
           onClose();
        }
        // If isShownAutomatically is true, Escape key does nothing.
        // Modal must be closed by the Acknowledge button.
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Initial focus if not counting down or if manually opened
      if (!isCountdownActive || !isShownAutomatically) { 
        setTimeout(() => {
            acknowledgeButtonRef.current?.focus();
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, isCountdownActive, isShownAutomatically]);

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
  }, [isOpen, isCountdownActive]); // Re-evaluate focusable elements when countdown active state changes

  if (!isOpen) {
    return null;
  }

  const handleLanguageToggleInModal = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setAppLanguage(newLang);
    // If countdown was active, restart it for the new language content
    if (isShownAutomatically) {
        startCountdown();
    }
  };

  const acknowledgeButtonText = isCountdownActive && isShownAutomatically
    ? t('disclaimerAcknowledgeButtonDisabledText', countdown) 
    : t('disclaimerModalAcknowledgeButton');

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-use-title"
      onClick={!isShownAutomatically ? onClose : undefined} // Only allow overlay click to close if opened manually
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-2xl w-full max-w-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
          <h2 id="how-to-use-title" className="text-lg sm:text-xl font-semibold text-teal-600 dark:text-teal-500">{t('howToUseAppTitle')}</h2>
          <div className="flex items-center"> {/* Removed space-x-2 as only one button remains here */}
            <button
              onClick={handleLanguageToggleInModal}
              className="px-2 py-1 text-xs sm:text-sm font-semibold text-slate-300 hover:text-teal-400 transition-colors rounded-md hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label={language === 'id' ? t('howToUseSwitchToEnglish') : t('howToUseSwitchToIndonesian')}
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>
            {/* "X" Close button removed from here */}
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-4 pr-1 text-sm sm:text-base" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
          <p className="text-slate-300 text-center mb-3">{t('appSubtitle')}</p>

          <h3 className="text-md font-semibold text-teal-500 dark:text-teal-400 mt-2 mb-1.5">{t('howToUseDiagramTitle')}</h3>
          <div className="my-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex justify-center items-center">
            <WorkflowDiagramIcon className="w-full h-auto max-w-lg"/>
          </div>

          <h3 className="text-md font-semibold text-teal-500 dark:text-teal-400 mt-4 mb-1.5">{t('howToUseAppTitleShort')}:</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
            <li>{t('howToUseStep1')}</li>
            <li>{t('howToUseStep2')}</li>
            <li>{t('howToUseStep3')}</li>
            <li>{t('howToUseStep4')}</li>
            <li>{t('howToUseStep5')}</li>
            <li>{t('howToUseStep5b')}</li> 
            <li>{t('howToUseStep6')}</li> 
          </ol>
          <p className="mt-3 text-teal-400 dark:text-teal-300 font-semibold text-xs italic pl-1">{t('howToUseTip')}</p>
        </div>

        <button
          ref={acknowledgeButtonRef}
          onClick={onClose}
          disabled={isCountdownActive && isShownAutomatically}
          className={`mt-5 w-full px-4 py-3 rounded-lg transition-all duration-150 ease-in-out font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]
            ${isCountdownActive && isShownAutomatically
              ? 'bg-slate-500 text-slate-400 cursor-not-allowed' 
              : 'bg-teal-700 hover:bg-teal-600 text-white focus:ring-teal-500'
            }`}
        >
          <span className="button-text-content">{acknowledgeButtonText}</span>
        </button>
      </div>
    </div>
  );
};

export default HowToUseModal;
