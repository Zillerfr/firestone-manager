import HeroList from '../components/HeroList';
import './Pages.css';
import { useTranslation } from 'react-i18next';

export default function Characters() {
	const { t } = useTranslation();

	return (
		<div className="page-container">
			<h1 className="page-title">
				{t('characters.title')}
			</h1>
			<HeroList/>
		</div>
	);
}