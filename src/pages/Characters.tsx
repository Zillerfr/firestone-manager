import HeroList from '../components/HeroList';
import './Pages.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Characters() {
	const { t } = useTranslation();
    const navigate = useNavigate();

	return (
		<div className="page-container">
			<div className="page-title title-line">
                <h1>{t('characters.title')}</h1>
                <button
                    onClick={() => navigate('/characters-list')}
                    className="view-toggle-button"
                >
                    {t('characters.list_view')}
                </button>
            </div>
			<HeroList/>
		</div>
	);
}