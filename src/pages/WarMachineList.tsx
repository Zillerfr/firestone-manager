import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WarMachineTableList from '../components/WarMachineTableList';

const WarMachineList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="page-title title-line">
                <h1>{t('war_machines_list.title')}</h1>
                <button
                    onClick={() => navigate('/wm-crew')}
                    className="view-toggle-button"
                >
                    {t('wmcrew.title')}
                </button>
            </div>
            <WarMachineTableList />
        </div>
    );
};

export default WarMachineList;