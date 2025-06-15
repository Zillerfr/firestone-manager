import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

export default function Navigator() {
	// Déterminez la classe CSS basée sur la route
	const mainContentClass =
		location.pathname === '/firestone-manager/'
			? 'main-content-centered'
			: 'main-content-top';

	console.log('TEST', location.pathname);

	return (
		<main className={mainContentClass}>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</main>
	);
}
