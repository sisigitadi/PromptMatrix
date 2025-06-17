
import React, { useState, useEffect, useRef } from 'react';
import { SavedPrompt, TranslationKey } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { PencilIcon as EditIcon } from './icons/PencilIcon';
import { EraserIcon as DeleteIcon } from './icons/EraserIcon';
import { ClipboardIcon as LoadIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';
import { addPromptToDB, getAllPromptsFromDB } from '../db';


interface PromptStashPanelProps {
  savedPrompts: SavedPrompt[];
  onLoadPrompt: (promptId: number) => void;
  onDeletePrompt: (promptId: number) => void;
  onRenamePrompt: (promptId: number, newName: string) => void;
  isLoading: boolean;
  dbError: string | null;
  showToast: (type: 'success' | 'error', messageKey: TranslationKey, ...args: any[]) => void;
  reloadPrompts: () => void;
  appVersion: string; // Added appVersion prop
}

const PromptStashPanel: React.FC<PromptStashPanelProps> = ({
  savedPrompts,
  onLoadPrompt,
  onDeletePrompt,
  onRenamePrompt,
  isLoading,
  dbError,
  showToast,
  reloadPrompts,
  appVersion, // Destructure appVersion
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingPromptId, setEditingPromptId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stashSearchTerm, setStashSearchTerm] = useState<string>('');


  useEffect(() => {
    if (editingPromptId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingPromptId]);

  const handleRename = (prompt: SavedPrompt) => {
    setEditingPromptId(prompt.id);
    setEditText(prompt.name);
  };

  const submitRename = (promptId: number) => {
    if (editText.trim()) {
      onRenamePrompt(promptId, editText.trim());
    }
    setEditingPromptId(null);
    setEditText('');
  };

  const promptPreviewText = (text: string) => {
    const maxLength = 70;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(t('languageID') === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleExportPrompts = async () => {
    try {
      const promptsToExport = await getAllPromptsFromDB();
      if (promptsToExport.length === 0) {
        showToast('error', 'noSavedPrompts');
        return;
      }
      const jsonData = JSON.stringify(promptsToExport, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Construct filename with version
      const filename = `promptmatrix_stash_backup_${appVersion.replace(/\./g, '_')}.json`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', 'promptsExportedSuccess');
    } catch (error) {
      console.error("Error exporting prompts:", error);
      showToast('error', 'errorExportingPrompts');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not readable text.');
        }
        const importedData = JSON.parse(text);

        if (!Array.isArray(importedData)) {
          throw new Error('Invalid file format: not an array.');
        }

        let importedCount = 0;
        for (const item of importedData) {
          // Basic validation for SavedPrompt structure (can be more thorough)
          if (typeof item === 'object' && item !== null && 'name' in item && 'generatedPrompt' in item && 'promptToCopy' in item) {
            const promptToAdd: Omit<SavedPrompt, 'id' | 'timestamp'> = {
              name: item.name,
              frameworkId: item.frameworkId || null,
              category: item.category || 'text',
              promptComponents: item.promptComponents || [],
              interactiveFormValues: item.interactiveFormValues || {},
              otherInputValues: item.otherInputValues || {},
              userDefinedInteraction: item.userDefinedInteraction || '',
              generatedPrompt: item.generatedPrompt,
              promptToCopy: item.promptToCopy,
              language: item.language || 'en',
              selectedFrameworkName: item.selectedFrameworkName || item.name,
            };
            await addPromptToDB(promptToAdd);
            importedCount++;
          }
        }
        reloadPrompts();
        showToast('success', 'promptsImportedSuccess', importedCount);
      } catch (error) {
        console.error("Error importing prompts:", error);
        showToast('error', 'errorImportingPrompts');
      } finally {
        // Reset file input to allow importing the same file again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const filteredSavedPrompts = savedPrompts.filter(prompt => {
    if (!stashSearchTerm.trim()) return true;
    const searchTermLower = stashSearchTerm.toLowerCase();
    return (
      prompt.name.toLowerCase().includes(searchTermLower) ||
      (prompt.selectedFrameworkName && prompt.selectedFrameworkName.toLowerCase().includes(searchTermLower)) ||
      prompt.promptToCopy.toLowerCase().includes(searchTermLower)
    );
  });


  return (
    <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50">
      <div
        className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50 cursor-pointer hover:bg-slate-700/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="prompt-stash-content"
      >
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-600">{t('promptStashTitle')}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('promptStashDescription')}</p>
        </div>
        {isExpanded ? <ChevronUpIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" /> : <ChevronDownIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" />}
      </div>

      <div id="prompt-stash-content" className={`p-3 sm:p-4 space-y-3 ${isExpanded ? 'collapsible-content open' : 'collapsible-content'}`}>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <button
              onClick={handleExportPrompts}
              className="flex-1 py-2 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              title={t('exportPromptsButtonAria')}
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="button-text-content">{t('exportPromptsButton')}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
              aria-label={t('selectJsonFile')}
            />
            <button
              onClick={handleImportClick}
              className="flex-1 py-2 px-3 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
              title={t('importPromptsButtonAria')}
            >
              <UploadIcon className="w-4 h-4" />
              <span className="button-text-content">{t('importPromptsButton')}</span>
            </button>
        </div>
         <input
            type="text"
            placeholder={t('searchInStashPlaceholder')}
            value={stashSearchTerm}
            onChange={(e) => setStashSearchTerm(e.target.value)}
            className="w-full p-2 mb-2 bg-slate-600/70 dark:bg-slate-700/60 border border-slate-500 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs text-slate-100 placeholder-slate-400/70 non-copyable-input-field"
          />

        {isLoading && <p className="text-sm text-slate-400 animate-pulse">{t('suggestionsLoading')}</p>}
        {dbError && <p className="text-sm text-rose-400">{dbError}</p>}

        {!isLoading && !dbError && filteredSavedPrompts.length === 0 && (
          <p className="text-sm text-center text-slate-400 py-4">
            {stashSearchTerm.trim() ? t('noFrameworksFoundError') : t('noSavedPrompts')}
          </p>
        )}

        {!isLoading && !dbError && filteredSavedPrompts.length > 0 && (
          <ul className="space-y-2 max-h-[350px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
            {filteredSavedPrompts.map((prompt) => (
              <li key={prompt.id} className="p-2.5 bg-slate-700/50 dark:bg-slate-700/60 rounded-lg border border-slate-600/70 shadow-sm hover:border-teal-600 transition-colors">
                {editingPromptId === prompt.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => submitRename(prompt.id)}
                      onKeyDown={(e) => e.key === 'Enter' && submitRename(prompt.id)}
                      className="flex-grow p-1.5 bg-slate-600 border border-slate-500 rounded-md text-xs text-slate-100 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <button
                        onClick={() => submitRename(prompt.id)}
                        className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                        title={t('savePromptButton')}
                    >
                        <span className="button-text-content">{t('savePromptButton')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-grow mb-1.5 sm:mb-0">
                      <p className="text-xs font-semibold text-teal-400 dark:text-teal-300 break-all">{prompt.name}</p>
                      <p className="text-[0.65rem] text-slate-400 dark:text-slate-500">
                        {prompt.selectedFrameworkName ? `${prompt.selectedFrameworkName} | ` : ''}
                        {formatDate(prompt.timestamp)}
                      </p>
                       <p className="text-[0.7rem] italic text-slate-300 mt-0.5 break-all">{promptPreviewText(prompt.promptToCopy)}</p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 mt-1 sm:mt-0 self-end sm:self-center">
                      <button
                        onClick={() => onLoadPrompt(prompt.id)}
                        className="p-1.5 text-xs bg-teal-700 hover:bg-teal-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 flex items-center space-x-1"
                        title={t('loadPromptButton')}
                      >
                        <LoadIcon className="w-3 h-3"/> <span className="button-text-content">{t('loadPromptButton')}</span>
                      </button>
                      <button
                        onClick={() => handleRename(prompt)}
                        className="p-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400 flex items-center space-x-1"
                        title={t('renamePromptButton')}
                      >
                         <EditIcon className="w-3 h-3"/> <span className="button-text-content">{t('renamePromptButton')}</span>
                      </button>
                      <button
                        onClick={() => {
                            if (window.confirm(t('confirmDeletePromptMessage', prompt.name))) {
                                onDeletePrompt(prompt.id);
                            }
                        }}
                        className="p-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-rose-400 flex items-center space-x-1"
                        title={t('deletePromptButton')}
                      >
                        <DeleteIcon className="w-3 h-3"/> <span className="button-text-content">{t('deletePromptButton')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {!isExpanded && (
        <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
          {t('clickToExpandOutputPanel')} {/* Reusing a similar key, consider making specific */}
        </p>
      )}
    </div>
  );
};

export default PromptStashPanel;
