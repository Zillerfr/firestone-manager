import React from 'react';
import './CrewTableRow.css'; // Créez ce fichier CSS si nécessaire
import { useTranslation } from 'react-i18next';

interface CrewTableRowProps {
    heroData: {
        hero: any; // Hero
        characterInfo: any; // Character
        warMachineInfo: any | null; // WarMachine | null
        characterName: string;
        spec: string;
        health: number;
        potentialHealth: number;
        dmg: number;
        potentialDmg: number;
        resist: number;
        potentialResist: number;
        healthResist: number;
        potentialHealthResist: number;        
    };
    getCharacterImage: (id: string) => string;
    getMachineImage: (id: string) => string;
    capitalizeFirstLetter: (str: string) => string;
}

const CrewTableRow: React.FC<CrewTableRowProps> = ({
    heroData,
    getCharacterImage,
    getMachineImage
}) => {
    const { hero, characterName, spec, health, potentialHealth, dmg, potentialDmg, resist, potentialResist, healthResist, potentialHealthResist } = heroData;
    const { t } = useTranslation();

    const characterImageUrl = getCharacterImage(hero.id);
    const warMachineImageUrl = getMachineImage(hero.warMachine); // Utilise hero.warMachine pour l'ID de la machine
    const displayedWarMachineName = t(`warmachines.${hero.warMachine}`);
    const displayedSpecialisation = t(`speciality.${spec}`);

    return (
        <tr className="crew-table-row">
            <td>
                <div className="character-cell">
                    <img src={characterImageUrl} alt={characterName} className="character-image" />
                    <span>{characterName}</span>
                </div>
            </td>
            <td>{displayedSpecialisation}</td>
            <td>
                <div className="war-machine-cell">
                    <img src={warMachineImageUrl} alt={displayedWarMachineName} className="war-machine-image" />
                    <span>{displayedWarMachineName}</span>
                </div>
            </td>
            <td>{dmg.toFixed(0)}</td>
            <td>{potentialDmg.toFixed(0)}</td>
            <td>{health.toFixed(0)}</td>
            <td>{potentialHealth.toFixed(0)}</td>
            <td>{resist.toFixed(0)}</td>
            <td>{potentialResist.toFixed(0)}</td>
            <td>{healthResist.toFixed(0)}</td>
            <td>{potentialHealthResist.toFixed(0)}</td>
        </tr>
    );
};

export default CrewTableRow;