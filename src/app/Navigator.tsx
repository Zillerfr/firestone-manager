import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Characters from '../pages/Characters';
import DataManagement from '../pages/DataManagement';
import WarMachineCrew from '../pages/WarMachineCrew';
import CharactersList from '../pages/CharactersList';

export default function Navigator() {
	const location = useLocation();
	// Déterminez la classe CSS basée sur la route
	const mainContentClass =
		location.pathname === '/' || location.pathname === '/firestone-manager/'
			? 'main-content-centered'
			: 'main-content-top';

	return (
		<main className={mainContentClass}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/characters" element={<Characters />} />
				<Route path="/data-management" element={<DataManagement />} />
				<Route path="/wm-crew" element={<WarMachineCrew />} />
				<Route path="/characters-list" element={<CharactersList />} />
			</Routes>
		</main>
	);
}
