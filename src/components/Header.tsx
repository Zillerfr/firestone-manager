import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

export default function Header() {
    const { t } = useTranslation();
	return (
		<header className="app-header">
			<nav>
				<ul className="nav-left">
					<li>
						<Link to="/">{t('header.home_link')}</Link>
					</li>
				</ul>
				<ul className="nav-right">
					<li>
						<Link to="/characters">{t('header.characters_link')}</Link>
					</li>
					<li><Link to="/">{'TODO'}</Link></li>
				</ul>
			</nav>
		</header>
	);
}
