import WarMachineCrewArray from '../components/WarMachineCrewArray';
import './Pages.css';
import { useTranslation } from 'react-i18next';

export default function WarMachineCrew() {
	const { t } = useTranslation();

	return (
		<div className="page-container">
			<h1 className="page-title">
				{t('wmcrew.title')}
			</h1>
			<WarMachineCrewArray />
		</div>
	);
}