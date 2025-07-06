import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './WarMachineSelector.css'; // Pour le style du sélecteur

// Importez toutes les images de machines de guerre
const warMachineImages = import.meta.glob('../assets/machines/*.webp', { eager: true, as: 'url' });
const defaultTankIcon = new URL('../assets/icons/tank.svg', import.meta.url).href; // Import direct pour SVG

interface WarMachineSelectorProps {
    currentWarMachineId: string;
    warMachineOptions: string[]; // Liste des IDs de machines de guerre possibles
    onChange: (selectedId: string) => void;
}

const getWarMachineImage = (id: string): string => {
    if (id === 'none' || !id) {
        return defaultTankIcon; // Icône par défaut si "none" ou vide
    }
    const imagePath = `../assets/machines/${id}.webp`;
    if (warMachineImages[imagePath]) {
        return warMachineImages[imagePath] as string;
    }
    console.warn(`Image for war machine ${id}.webp not found at path: ${imagePath}`);
    return defaultTankIcon; // Fallback par défaut
};

const WarMachineSelector: React.FC<WarMachineSelectorProps> = ({
    currentWarMachineId,
    warMachineOptions,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleToggle = () => setIsOpen(!isOpen);
    
    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
    };
    
    
    const { t } = useTranslation();
    const displayedMachineName = t(`warmachines.${currentWarMachineId}`);

    return (
        <div className="war-machine-selector">
            <div className="selected-machine" onClick={handleToggle}>
                <img
                    src={getWarMachineImage(currentWarMachineId)}
                    alt={currentWarMachineId}
                    className="machine-image"
                />
                <span>{displayedMachineName}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className="options-dropdown">
                    <div className="option-item" onClick={() => handleSelect('none')}>
                        <img src={defaultTankIcon} alt="Aucune" className="machine-image" />
                        <span>{t('warmachines.none')}</span>
                    </div>
                    {warMachineOptions.map(machineId => (
                        <div key={machineId} className="option-item" onClick={() => handleSelect(machineId)}>
                            <img src={getWarMachineImage(machineId)} alt={machineId} className="machine-image" />
                            <span>{t(`warmachines.${machineId}`)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WarMachineSelector;