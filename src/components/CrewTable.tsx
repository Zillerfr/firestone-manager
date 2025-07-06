import React from 'react';
import CrewTableHeader from './CrewTableHeader';
import CrewTableRow from './CrewTableRow';
import './CrewTable.css'; // Créez ce fichier CSS si nécessaire
import type { SortKey } from './WarMachineCrewArray'; // <--- ADD THIS IMPORT
import { useTranslation } from 'react-i18next';

interface CrewTableProps {
    heroes: any[]; // CombinedHeroData[] from WarMachineCrewArray
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (key: SortKey) => void; // <--- CHANGE THIS LINE
    getCharacterImage: (id: string) => string;
    getMachineImage: (id: string) => string;
    capitalizeFirstLetter: (str: string) => string;
}

const CrewTable: React.FC<CrewTableProps> = ({
    heroes,
    sortBy,
    sortOrder,
    onSort,
    getCharacterImage,
    getMachineImage,
    capitalizeFirstLetter,
}) => {
    const { t } = useTranslation();
    return (
        <div className="crew-table-container">
            <table className="crew-table">
                <thead>
                    <tr>
                        <CrewTableHeader
                            title={t('wmcrew.tab_char')}
                            sortKey="characterName"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_spec')}
                            sortKey="spec"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_WM')}
                            sortKey="warMachineName"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_damage')}
                            sortKey="dmg"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_damage_potential')}
                            sortKey="potentialDmg"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_health')}
                            sortKey="health"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_health_potential')}
                            sortKey="potentialHealth"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_resistance')}
                            sortKey="resist"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_resistance_potential')}
                            sortKey="potentialResist"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_health_resistane')}
                            sortKey="healthResist"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                        <CrewTableHeader
                            title={t('wmcrew.tab_health_resistane_potential')}
                            sortKey="potentialHealthResist"
                            currentSortBy={sortBy}
                            currentSortOrder={sortOrder}
                            onSort={onSort}
                        />
                    </tr>
                </thead>
                <tbody>
                    {heroes.length === 0 ? (
                        <tr>
                            <td colSpan={11} className="no-heroes-message">{t('wmcrew.no_character')}</td>
                        </tr>
                    ) : (
                        heroes.map(heroData => (
                            <CrewTableRow
                                key={heroData.hero.id}
                                heroData={heroData}
                                getCharacterImage={getCharacterImage}
                                getMachineImage={getMachineImage}
                                capitalizeFirstLetter={capitalizeFirstLetter}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CrewTable;