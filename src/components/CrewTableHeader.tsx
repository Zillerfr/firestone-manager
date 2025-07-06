import React from 'react';
import './CrewTableHeader.css'; // Créez ce fichier CSS si nécessaire
import type { SortKey } from './WarMachineCrewArray'; // <--- ADD THIS IMPORT

interface CrewTableHeaderProps {
    title: string;
    sortKey: SortKey; // <--- CHANGE THIS LINE
    currentSortBy: string;
    currentSortOrder: 'asc' | 'desc';
    onSort: (key: SortKey) => void; // <--- CHANGE THIS LINE
}

const CrewTableHeader: React.FC<CrewTableHeaderProps> = ({
    title,
    sortKey,
    currentSortBy,
    currentSortOrder,
    onSort,
}) => {
    const isSorted = currentSortBy === sortKey;
    const arrow = isSorted ? (currentSortOrder === 'asc' ? '▲' : '▼') : '';

    return (
        <th className={`crew-table-header ${isSorted ? 'sorted' : ''}`} onClick={() => onSort(sortKey)}>
            {title} {arrow}
        </th>
    );
};

export default CrewTableHeader;