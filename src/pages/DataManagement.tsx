// src/pages/DataManagement.tsx
import React, { useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal'; // Assurez-vous que ce composant existe
import './Pages.css'; // Styles généraux des pages
import { useTranslation } from 'react-i18next';

const DataManagement: React.FC = () => {
	const { t } = useTranslation();

	const [exportedData, setExportedData] = useState<string>('');
	const [importData, setImportData] = useState<string>('');
	const [isClearDataModalOpen, setIsClearDataModalOpen] =
		useState<boolean>(false);
	const [isImportConfirmationModalOpen, setIsImportConfirmationModalOpen] =
		useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const LOCAL_STORAGE_KEYS = {
		heroes: 'firestone_manager.heroes'
	};

	const clearMessages = () => {
		setError(null);
		setSuccessMessage(null);
	};

	// --- Export Logic ---
	const handleExportData = () => {
		clearMessages();
		try {
			const dataToExport = {
				heroes: localStorage.getItem(LOCAL_STORAGE_KEYS.heroes)
			};

			// Convertir l'objet en chaîne JSON
			const jsonString = JSON.stringify(dataToExport);

			// Encoder la chaîne JSON en Base64
			const encodedData = btoa(jsonString); // `btoa` pour encoder en base64

			setExportedData(encodedData);
			setSuccessMessage(t('data_management.export.success'));
		} catch (e) {
			console.error(t('data_management.export.error'), e);
			setError(t('data_management.export.error_message'));
		}
	};

	const handleCopyExportedData = () => {
		if (exportedData) {
			navigator.clipboard
				.writeText(exportedData)
				.then(() => {
					setSuccessMessage(t('data_management.export.copy_success'));
				})
				.catch(err => {
					console.error(t('data_management.export.copy_error'), err);
					setError(t('data_management.export.copy_error_message'));
				});
		}
	};

	// --- Import Logic ---
	const handleImportConfirmation = () => {
		clearMessages();
		if (!importData) {
			setError(t('data_management.import.error'));
			return;
		}
		setIsImportConfirmationModalOpen(true);
	};

	const handleImportData = () => {
		clearMessages();
		setIsImportConfirmationModalOpen(false); // Fermer la modale de confirmation
		try {
			// Décoder la chaîne Base64
			const decodedJsonString = atob(importData); // `atob` pour décoder du base64

			// Parser la chaîne JSON en objet
			const importedDataObject = JSON.parse(decodedJsonString);

			// Vérifier la structure des données importées (simple validation)
			if (
				typeof importedDataObject !== 'object' ||
				!('heroes' in importedDataObject)
			) {
				throw new Error(t('data_management.import.error_message'));
			}

			// Remplacer les données dans le Local Storage
			// Les valeurs nulles ou non définies sont gérées par setItem (elles seront stockées comme "null" ou "undefined")
			// ou vous pouvez choisir de ne pas les stocker si vous préférez.
			if (
				importedDataObject.heroes !== null &&
				importedDataObject.heroes !== undefined
			) {
				console.log("TEST import dans ", LOCAL_STORAGE_KEYS.heroes);
				console.log("TEST import de ", importedDataObject.heroes);
				localStorage.setItem(
					LOCAL_STORAGE_KEYS.heroes,
					importedDataObject.heroes
				);
			} else {
				localStorage.removeItem(LOCAL_STORAGE_KEYS.heroes);
			}

			setSuccessMessage(t('data_management.import.success'));
			// Recharger la page pour que les autres composants de l'application voient les nouvelles données
			setTimeout(() => window.location.href = '/firestone-manager/', 1500);
		} catch (e: any) {
			console.error(t('data_management.import.error2'), e);
			setError(
				`${t('data_management.import.error2_message')} ${
					e.message || t('data_management.import.error2_message2')
				}.`
			);
		}
	};

	// --- Clear All Data Logic ---
	const handleClearAllDataConfirmation = () => {
		clearMessages();
		setIsClearDataModalOpen(true);
	};

	const handleClearAllData = () => {
		clearMessages();
		try {
			localStorage.removeItem(LOCAL_STORAGE_KEYS.heroes);
			setSuccessMessage(t('data_management.reset.success'));
			setIsClearDataModalOpen(false);
			// Recharger la page pour refléter la suppression complète des données
			setTimeout(() => window.location.href = '/firestone-manager/', 1500);
		} catch (e) {
			console.error(t('data_management.reset.error'), e);
			setError(t('data_management.reset.error_message'));
		}
	};

	return (
		<div className="page-container">
			{/* Header Section - Similar to other management pages */}
			<div className="page-title title-line">
				<h2>{t('data_management.title')}</h2>
				<button
					onClick={handleClearAllDataConfirmation}
					className="delete-entity-button"
					title={t('data_management.reset.title')}
				>
					{t('data_management.reset.title')}
				</button>
			</div>

			{/* Main Content Section */}
			<div className="content-section">
				{error && <p className="error-message">{error}</p>}
				{successMessage && <p className="success-message">{successMessage}</p>}
				{/* Export Section */}
				<div className="data-section">
					<h3>{t('data_management.export.title')}</h3>
					<p>
						{t('data_management.export.text')}.
					</p>
					<button onClick={handleExportData} className="button-primary">
						{t('data_management.export.button')}
					</button>
					{exportedData && (
						<div className="form-group" style={{ marginTop: '15px' }}>
							<label htmlFor="export-data-textarea">
								{t('data_management.export.text2')} :
							</label>
							<textarea
								id="export-data-textarea"
								rows={10}
								value={exportedData}
								readOnly
								className="data-textarea"
							></textarea>
							<button
								onClick={handleCopyExportedData}
								className="button-secondary"
								style={{ marginTop: '10px' }}
							>
								{t('data_management.export.button2')}
							</button>
						</div>
					)}
				</div>
				<hr className="section-divider" /> {/* Visually separates sections */}
				{/* Import Section */}
				<div className="data-section">
					<h3>{t('data_management.import.title')}</h3>
					<p>
						{t('data_management.import.text')}
					</p>
					<div className="form-group">
						<label htmlFor="import-data-textarea">
							{t('data_management.import.text2')} :
						</label>
						<textarea
							id="import-data-textarea"
							rows={10}
							value={importData}
							onChange={e => {
								setImportData(e.target.value);
								clearMessages(); // Clear messages on input change
							}}
							className="data-textarea"
							placeholder={t('data_management.import.placeholder')}
						></textarea>
						<button
							onClick={handleImportConfirmation}
							className="button-primary"
							style={{ marginTop: '10px' }}
							disabled={!importData}
						>
							{t('data_management.import.button')}
						</button>
					</div>
				</div>
			</div>

			{/* Confirmation Modals */}
			<ConfirmationModal
				isOpen={isClearDataModalOpen}
				onClose={() => setIsClearDataModalOpen(false)}
				onConfirm={handleClearAllData}
				message={t('data_management.reset.popin_message')}
			/>

			<ConfirmationModal
				isOpen={isImportConfirmationModalOpen}
				onClose={() => setIsImportConfirmationModalOpen(false)}
				onConfirm={handleImportData}
				message={t('data_management.import.popin_message')}
			/>
		</div>
	);
};

export default DataManagement;
