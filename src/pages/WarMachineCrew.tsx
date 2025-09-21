import WarMachineCrewArray from '../components/WarMachineCrewArray';
import './Pages.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function WarMachineCrew() {
	const { t } = useTranslation();
    const navigate = useNavigate();

	return (
		<div className="page-container">
			<div className="page-title title-line">
				<h1>{t('wmcrew.title')}</h1>
				<button
                    onClick={() => navigate('/warmachines')}
                    className="view-toggle-button"
                >
                    {t('header.warmachines_link')}
                </button>
			</div>
			<WarMachineCrewArray />
		</div>
	);
}