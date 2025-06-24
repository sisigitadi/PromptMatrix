
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext'; // Corrected path
import { InfoIcon } from '../icons/InfoIcon'; // Corrected path

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyAvailable?: boolean;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ 
  isOpen, 
  onClose,
  apiKeyAvailable = false 
}) => {
  const { t, language, setLanguage: setAppLanguage } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const acknowledgeButtonRef = useRef<HTMLButtonElement>(null);

  const [countdown, setCountdown] = useState(5);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
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
    if (isOpen) {
      startCountdown();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsCountdownActive(true); 
      setCountdown(5); 
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, language]); 

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCountdownActive) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      if (!isCountdownActive) { 
        setTimeout(() => {
            acknowledgeButtonRef.current?.focus();
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, isCountdownActive]);


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
  }, [isOpen, isCountdownActive]); 

  if (!isOpen) {
    return null;
  }

  const handleLanguageToggleInModal = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setAppLanguage(newLang);
  };

  const acknowledgeButtonText = isCountdownActive 
    ? t('disclaimerAcknowledgeButtonDisabledText', countdown) 
    : t('disclaimerModalAcknowledgeButton');

  const disclaimerPoint2Key = apiKeyAvailable ? 'disclaimerPoint2Premium' : 'disclaimerPoint2Free';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      onClick={isCountdownActive ? undefined : onClose} 
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-2xl w-full max-w-xl p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
        tabIndex={-1} 
      >
        <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center">
            <InfoIcon className="w-6 h-6 sm:w-7 sm:h-7 text-teal-700 dark:text-teal-600 mr-2.5 shrink-0" />
            <h2 id="disclaimer-title" className="text-lg sm:text-xl font-semibold text-teal-600 dark:text-teal-500">{t('disclaimerTitle')}</h2>
          </div>
          <button
            onClick={handleLanguageToggleInModal}
            className="px-2 py-1 text-xs sm:text-sm font-semibold text-slate-300 hover:text-teal-400 transition-colors rounded-md hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            aria-label={language === 'id' ? t('disclaimerSwitchToEnglish') : t('disclaimerSwitchToIndonesian')}
          >
            {language === 'id' ? 'EN' : 'ID'}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-sm sm:text-base" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-1">
            <li>{t('disclaimerPoint1')}</li>
            <li>{t(disclaimerPoint2Key)}</li>
            <li>{t('disclaimerPoint3')}</li>
          </ul>
          <p className="mt-3 text-slate-300 pl-1">
            {t('disclaimerContactPrompt')}{' '}
            <a href="mailto:si.sigitadi@gmail.com" className="text-teal-600 dark:text-teal-500 hover:text-teal-500 dark:hover:text-teal-400 underline focus:outline-none focus:ring-1 focus:ring-teal-500 rounded-sm">
              si.sigitadi@gmail.com
            </a>
          </p>
        </div>

        <button
          ref={acknowledgeButtonRef}
          onClick={onClose}
          disabled={isCountdownActive}
          className={`mt-5 w-full px-4 py-3 rounded-lg transition-all duration-150 ease-in-out font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]
            ${isCountdownActive 
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

export default DisclaimerModal;
