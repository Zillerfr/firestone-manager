import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Characters from '../pages/Characters';
import DataManagement from '../pages/DataManagement';

export default function Navigator() {
	const location = useLocation();
	// Déterminez la classe CSS basée sur la route
	const mainContentClass =
		location.pathname === '/' || location.pathname === '/firestone-manager/'
			? 'main-content-centered'
			: 'main-content-top';

	 console.log('Current Path:', location.pathname);

	return (
		<main className={mainContentClass}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/characters" element={<Characters />} />
				<Route path="/data-management" element={<DataManagement />} />
			</Routes>
		</main>
	);
}
