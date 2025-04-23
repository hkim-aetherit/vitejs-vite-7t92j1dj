import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationKO from './locales/ko.json';

const LANGUAGE_KEY = 'language';

const resources = {
  en: {
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
};

// Get saved language or default to Korean
const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
const defaultLanguage = savedLanguage || 'ko';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'ko',
    lng: defaultLanguage,
    supportedLngs: ['ko', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: LANGUAGE_KEY,
      caches: ['localStorage'],
    },
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_KEY, lng);
});

export default i18n;