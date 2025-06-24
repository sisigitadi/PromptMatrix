import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Updated to match default export from App.tsx
import { LanguageProvider } from './contexts/LanguageContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

export {}; // Explicitly mark as an ES module