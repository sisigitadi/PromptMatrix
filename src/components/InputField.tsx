import React from 'react';
import { AiTextIcon } from './AiTextIcon'; // Asumsikan path ini benar

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
  placeholder: string;
  isTextarea?: boolean;
  rows?: number;
  description?: string;
  predefinedOptions?: string[];
  isVisible: boolean;
  fetchSuggestions: (fieldId: string) => void;
  frameworkName: string;
  apiKeyAvailable: boolean;
  exampleText?: string;
  tooltip?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  isTextarea = false,
  rows = 2,
  description,
  isVisible,
  apiKeyAvailable,
  fetchSuggestions,
  // predefinedOptions, // Implementasi dropdown/select bisa ditambahkan di sini jika perlu
  tooltip,
}) => {
  if (!isVisible) return null;

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="mb-4" title={tooltip}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <InputComponent
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          rows={isTextarea ? rows : undefined}
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
        />
        <button onClick={() => fetchSuggestions(id)} title="Get AI Suggestions for this field" className="absolute top-1/2 right-2 -translate-y-1/2" disabled={!apiKeyAvailable}>
            <AiTextIcon isAiFeatureActive={apiKeyAvailable} isLoading={false} />
        </button>
      </div>
      {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
};