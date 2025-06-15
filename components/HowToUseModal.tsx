
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { WorkflowDiagramIcon } from './icons/WorkflowDiagramIcon'; // New import

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose }) => {
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
      ).filter(el => el.offsetParent !== null);

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
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-use-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-2xl w-full max-w-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color)]">
          <h2 id="how-to-use-title" className="text-lg sm:text-xl font-semibold text-teal-600 dark:text-teal-500">{t('howToUseAppTitle')}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLanguageToggleInModal}
              className="px-2 py-1 text-xs sm:text-sm font-semibold text-slate-300 hover:text-teal-400 transition-colors rounded-md hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label={language === 'id' ? t('howToUseSwitchToEnglish') : t('howToUseSwitchToIndonesian')}
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close how to use instructions"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
            <li>{t('howToUseStep6')}</li>
          </ol>
          <p className="mt-3 text-teal-400 dark:text-teal-300 font-semibold text-xs italic pl-1">{t('howToUseTip')}</p>
        </div>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="mt-5 w-full px-4 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors duration-150 ease-in-out font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]"
        >
          <span className="button-text-content">{t('disclaimerModalAcknowledgeButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default HowToUseModal;