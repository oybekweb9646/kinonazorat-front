import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { getLanguage, setLanguage } from '@/service/storage';
import Uz from './translations/uz.json';
import Uzc from './translations/uzc.json';
import Ru from './translations/ru.json';

export const languages = ['uz', 'ru', 'uzc'];

const resources = {
  uz: {
    translation: Uz,
  },
  ru: {
    translation: Ru,
  },
  uzc: {
    translation: Uzc,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpBackend)
  .init({
    resources: resources,
    fallbackLng: 'uz',
    lng: getLanguage() || 'uz',
    supportedLngs: languages,
    saveMissing: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // backend: {
    //   addPath: import.meta.env.VITE_APP_BASE_URL + '/api/translations/{{lng}}',
    //   loadPath: import.meta.env.VITE_APP_BASE_URL + '/client/translations/?lang={{lng}}',
    // },
  });

export const changeLanguage = (lng: string) => {
  i18next.changeLanguage(lng);
  setLanguage(lng);
};

export default i18next;
