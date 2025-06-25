import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Updated to match default export from App.tsx
import { LanguageProvider } from './contexts/LanguageContext'; // Asumsi path ini benar
import ErrorBoundary from './src/components/ErrorBoundary'; // Import Error Boundary
import './src/i18n'; // Import dan jalankan konfigurasi i18n

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export {}; // Explicitly mark as an ES module