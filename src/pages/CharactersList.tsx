import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroTableList from '../components/HeroTableList';

const CharactersList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-title title-line">
                <h1>{t('characters_list.title')}</h1>
                <button
                    onClick={() => navigate('/characters')}
                    className="view-toggle-button"
                >
                    {t('characters_list.detailed_view')}
                </button>
            </div>
            <HeroTableList />
        </div>
    );
};

export default CharactersList;
