// src/pages/Home.tsx
import AureliaFairy from '../assets/logo/AureliaFairy.webp';
import { useTranslation } from 'react-i18next';
import './Home.css';

export default function Home() {
	const { t } = useTranslation();

	return (
		<div className="home-container">
			<h1 className="home-title">
				{t('home_message')}
				<br />
				Firestone Idle RPG
			</h1>
			<img src={AureliaFairy} alt="Aurelia Fairy" className="home-logo" />
		</div>
	);
}
