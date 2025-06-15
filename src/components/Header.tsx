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
						<Link to="/">{t('home_link')}</Link>
					</li>
				</ul>
				<ul className="nav-right">
					<li>TODO</li>
					<li>TODO</li>
				</ul>
			</nav>
		</header>
	);
}
