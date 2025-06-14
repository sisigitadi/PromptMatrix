
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface ToolLinkSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; url: string }[];
  title: string;
}

const ToolLinkSelectorModal: React.FC<ToolLinkSelectorModalProps> = ({ isOpen, onClose, links, title }) => {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const [customUrl, setCustomUrl] = useState('');
  const customUrlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      setTimeout(() => {
         const firstButton = modalRef.current?.querySelector('button, input[type="url"]') as HTMLElement | null;
         firstButton?.focus();
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

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCustomUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(event.target.value);
  };

  const handleOpenCustomUrl = () => {
    if (customUrl.trim()) {
      let urlToOpen = customUrl.trim();
      if (!urlToOpen.startsWith('http://') && !urlToOpen.startsWith('https://')) {
        urlToOpen = 'https://' + urlToOpen;
      }
      try {
        new URL(urlToOpen); 
        window.open(urlToOpen, '_blank', 'noopener,noreferrer');
        onClose();
      } catch (e) {
        console.error("Invalid URL:", urlToOpen);
        alert("Please enter a valid URL (e.g., https://example.com)");
        customUrlInputRef.current?.focus();
      }
    } else {
        customUrlInputRef.current?.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-selector-title"
      onClick={onClose} 
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
        tabIndex={-1} 
      >
        <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
          <h2 id="tool-selector-title" className="text-xl sm:text-2xl font-semibold text-teal-600 dark:text-teal-500">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Close tool selector"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.url)}
              className="w-full flex items-center justify-between text-left px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-700/70 hover:bg-teal-700/80 dark:hover:bg-teal-700/70 rounded-lg transition-all duration-150 ease-in-out group focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]"
            >
              <span className="button-text-content text-slate-100 group-hover:text-white text-sm sm:text-base font-medium">{link.name}</span>
              <ExternalLinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 dark:text-teal-400 group-hover:text-teal-300 dark:group-hover:text-teal-200 transition-colors" />
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
          <div>
            <label htmlFor="custom-tool-url" className="block text-sm font-medium text-teal-600 dark:text-teal-500 mb-1.5">
              {t('customToolUrlInputLabel')}
            </label>
            <div className="flex space-x-2">
              <input
                ref={customUrlInputRef}
                type="url"
                id="custom-tool-url"
                value={customUrl}
                onChange={handleCustomUrlChange}
                placeholder={t('customToolUrlInputPlaceholder')}
                className="flex-grow p-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none transition-all duration-150 text-slate-100 placeholder-slate-400/80 shadow-sm text-sm"
              />
              <button
                onClick={handleOpenCustomUrl}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors duration-150 ease-in-out font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]"
                aria-label={t('customToolUrlButtonAria')}
              >
                <span className="button-text-content">{t('customToolUrlButtonText')}</span>
              </button>
            </div>
          </div>
        </div>

         <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors duration-150 ease-in-out font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]"
          >
            <span className="button-text-content">Close</span>
          </button>
      </div>
    </div>
  );
};

export default ToolLinkSelectorModal;