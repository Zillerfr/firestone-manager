import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Pour charger les traductions à partir de fichiers
  .use(LanguageDetector) // Pour détecter la langue de l'utilisateur
  .use(initReactI18next) // Lie i18next avec React
  .init({
    fallbackLng: 'en', // Langue par défaut si une traduction est manquante ou la langue n'est pas détectée
    debug: true, // Utile pendant le développement
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    backend: {
      loadPath: '/firestone-manager/locales/{{lng}}/{{ns}}.json', // Chemin où vos fichiers de traduction seront stockés
    },
    react: {
      useSuspense: false, // Optionnel, active la Suspense de React pour le chargement des traductions
    },
  });

export default i18n;