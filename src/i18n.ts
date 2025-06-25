import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Anda dapat mengimpor terjemahan dari file terpisah di sini
// import enTranslation from './locales/en/translation.json';
// import idTranslation from './locales/id/translation.json';

// Placeholder terjemahan untuk memulai
const resources = {
  en: {
    translation: {
      // Contoh terjemahan
      "welcome": "Welcome to PromptMatrix!",
      "selectFramework": "Please select a framework from the header to start building your prompt.",
      "inputFieldPlaceholder": "Enter {{label}}...",
      "inputFieldDescription": "Provide details for the {{label}} component of the {{frameworkName}} framework.",
      "switchToEnglish": "Switch to English",
      "switchToIndonesian": "Switch to Indonesian",
      "searchResultsTitle": "Search Results",
      "textFrameworksTitle": "Text Frameworks",
      "frameworkListTitleNumbered": "2. {{frameworkName}}",
      // ... tambahkan terjemahan lain yang Anda butuhkan
    },
  },
  id: {
    translation: {
      "welcome": "Selamat datang di PromptMatrix!",
      "selectFramework": "Silakan pilih framework dari header untuk mulai membangun prompt Anda.",
      "inputFieldPlaceholder": "Masukkan {{label}}...",
      "inputFieldDescription": "Berikan detail untuk komponen {{label}} dari framework {{frameworkName}}.",
      "switchToEnglish": "Beralih ke Bahasa Inggris",
      "switchToIndonesian": "Beralih ke Bahasa Indonesia",
      "searchResultsTitle": "Hasil Pencarian",
      "textFrameworksTitle": "Framework Teks",
      "frameworkListTitleNumbered": "2. {{frameworkName}}",
      // ... tambahkan terjemahan lain yang Anda butuhkan
    },
  },
};

i18n
  .use(initReactI18next) // Mengikat i18next ke React
  .init({
    resources,
    lng: 'en', // Bahasa default
    fallbackLng: 'en', // Bahasa fallback jika terjemahan tidak ditemukan
    interpolation: {
      escapeValue: false, // React sudah melindungi dari XSS
    }, // Debugging (aktifkan ini jika Anda ingin melihat log i18next di konsol)
    debug: true, // Aktifkan debugging i18next
  });

export default i18n;