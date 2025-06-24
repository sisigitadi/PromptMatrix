
import React, { useEffect, useRef, useState } => 'react'; 
import { ExternalLinkIcon } from '../icons/ExternalLinkIcon'; 
import { useLanguage } from '../../contexts/LanguageContext'; 

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
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-selector-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] shadow-2xl w-full max-w-md p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id="tool-selector-modal-title" className="text-lg sm:text-xl font-semibold text-teal-600 dark:text-teal-500 pb-2 border-b border-[var(--border-color)]">
          {title}
        </h2>
        
        <div className="flex-grow overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
          {links.map((link) => (
            <button
              key={link.url}
              onClick={() => handleLinkClick(link.url)}
              className="w-full flex items-center justify-between text-left p-2.5 sm:p-3 bg-slate-600/70 hover:bg-teal-700 dark:bg-slate-700/60 dark:hover:bg-teal-700/80 text-slate-100 hover:text-white rounded-md transition-colors duration-150 shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <span className="button-text-content text-sm">{link.name}</span>
              <ExternalLinkIcon className="w-4 h-4 shrink-0 ml-2" />
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-[var(--border-color)] space-y-2">
           <label htmlFor="custom-tool-url" className="block text-xs text-slate-400">
            {t('customToolUrlInputLabel')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              ref={customUrlInputRef}
              id="custom-tool-url"
              type="url"
              value={customUrl}
              onChange={handleCustomUrlChange}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenCustomUrl()}
              placeholder={t('customToolUrlInputPlaceholder')}
              className="flex-grow p-2 text-sm bg-slate-600 border-slate-500 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-100 placeholder-slate-400/70 non-copyable-input-field"
            />
            <button
              onClick={handleOpenCustomUrl}
              disabled={!customUrl.trim()}
              className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-sm font-semibold transition-colors duration-150 disabled:bg-slate-500 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-sky-400"
              aria-label={t('customToolUrlButtonAria')}
            >
              <ExternalLinkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full px-4 py-2.5 rounded-lg transition-colors duration-150 font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]"
        >
          <span className="button-text-content">{t('cancelButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default ToolLinkSelectorModal;
