import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Character } from '../types/dataInterfaces';
import type { SortKey } from './HeroTableList';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import CharacterTableRow from './CharacterTableRow';
import itemTypes from '../data/itemTypes.json';

interface CharacterTableSectionProps {
    title: string;
    characters: Character[];
    sortBy: SortKey;
    sortOrder: 'asc' | 'desc';
    onSort: (key: SortKey) => void;
}

const CharacterTableSection: React.FC<CharacterTableSectionProps> = ({ title, characters, sortBy, sortOrder, onSort }) => {
    const { t } = useTranslation();
    const { list: heroes } = useSelector((state: RootState) => state.heroes);

    const getArrow = (key: SortKey) => {
        if (sortBy === key) {
            return sortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    const gearType = itemTypes.find(type => type.id === 'gear');
    const jewelType = itemTypes.find(type => type.id === 'jewel');
    const soulstoneType = itemTypes.find(type => type.id === 'soulstone');

    return (
        <section className="character-section">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => onSort('id')}>
                            {t('characters.character')}{getArrow('id')}
                        </th>
                        {gearType && <th>{t('items.gear')}</th>}
                        {jewelType && <th>{t('items.jewel')}</th>}
                        {soulstoneType && <th>{t('items.soulstone')}</th>}
                        <th>{t('characters.warmachine')}</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map(character => {
                        const heroData = heroes.find(h => h.id === character.id);
                        if (!heroData) return null; // Should not happen if filtered correctly in HeroTableList
                        return (
                            <CharacterTableRow
                                key={character.id}
                                character={character}
                            />
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
};

export default CharacterTableSection;
