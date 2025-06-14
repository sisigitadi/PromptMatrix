
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { InfoIcon } from './icons/InfoIcon';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const acknowledgeButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      setTimeout(() => {
        acknowledgeButtonRef.current?.focus();
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

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      onClick={onClose} 
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-2xl w-full max-w-xl p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
        tabIndex={-1} 
      >
        <div className="flex items-center pb-3 border-b border-[var(--border-color)]">
          <InfoIcon className="w-6 h-6 sm:w-7 sm:h-7 text-teal-700 dark:text-teal-600 mr-2.5 shrink-0" />
          <h2 id="disclaimer-title" className="text-lg sm:text-xl font-semibold text-teal-600 dark:text-teal-500">{t('disclaimerTitle')}</h2>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-sm sm:text-base" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-1">
            <li>{t('disclaimerPoint1')}</li>
            <li>{t('disclaimerPoint2')}</li>
            <li>{t('disclaimerPoint3')}</li>
            <li>{t('disclaimerPoint4')}</li>
          </ul>
          <p className="mt-3 text-slate-300 pl-1">
            {t('disclaimerContactPrompt')}{' '}
            <a href="mailto:si.sigitadi@gmail.com" className="text-teal-600 dark:text-teal-500 hover:text-teal-500 dark:hover:text-teal-400 underline focus:outline-none focus:ring-1 focus:ring-teal-500 rounded-sm">
              si.sigitadi@gmail.com
            </a>
          </p>
           <p className="mt-3 text-xs text-slate-400 pl-1">
            {t('disclaimerAiFeatureNote')}
          </p>
        </div>

        <button
          ref={acknowledgeButtonRef}
          onClick={onClose}
          className="mt-5 w-full px-4 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors duration-150 ease-in-out font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]"
        >
          <span className="button-text-content">{t('disclaimerModalAcknowledgeButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;