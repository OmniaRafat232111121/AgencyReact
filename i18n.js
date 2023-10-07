import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import  enTranslation  from './src/translations/en.json';
import  arTranslation  from './src/translations/ar.json'; // Import Arabic translations

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: enTranslation,
        dir: 'ltr',
      },
      ar: {
        translation: arTranslation,
        dir: 'rtl',
      },
    },
  });

export default i18n;
