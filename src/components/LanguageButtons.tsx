// src/components/LanguageButtons.tsx
import { useTranslation } from 'react-i18next';
import './LanguageButtons.css'; // Toujours pour les styles des boutons

/**
 * Composant LanguageButtons
 * Affiche des boutons sous forme de drapeaux pour changer la langue de l'application.
 */
export default function LanguageButtons() {
    // Utilise le hook useTranslation de react-i18next pour accéder à l'instance i18n
    const { i18n } = useTranslation();

    /**
     * Gère le changement de langue.
     * @param lng Le code de la nouvelle langue (ex: 'fr', 'en').
     */
    const changeLanguage = (lng: string): void => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-buttons-container">
            {/* Bouton pour le français */}
            <button
                className="language-button"
                onClick={() => changeLanguage('fr')}
                aria-label="Changer la langue en Français"
                title="Français" // Ajoute un titre pour l'infobulle
            >
                {/* Utilisation de flag-icons pour le drapeau français */}
                <span className="fi fi-fr flag-icon-size" aria-hidden="true"></span>
            </button>

            {/* Bouton pour l'anglais (ici, Royaume-Uni, car 'en' est une langue globale) */}
            <button
                className="language-button"
                onClick={() => changeLanguage('en')}
                aria-label="Change language to English"
                title="English" // Add a title for the tooltip
            >
                {/* Utilisation de flag-icons pour le drapeau du Royaume-Uni */}
                <span className="fi fi-gb flag-icon-size" aria-hidden="true"></span>
                {/* Si tu préfères les USA, tu peux remplacer 'fi-gb' par 'fi-us' */}
                {/* <span className="fi fi-us flag-icon-size" aria-hidden="true"></span> */}
            </button>
        </div>
    );
}