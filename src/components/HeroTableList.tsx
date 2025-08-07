import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CharacterTableSection from './CharacterTableSection';
import type { Character } from '../types/dataInterfaces';
import type { RootState } from '../store';
import charactersData from '../data/characters.json';

export type SortKey = 'default' | 'id' | 'spec';
type SortOrder = 'asc' | 'desc';

const HeroTableList: React.FC = () => {
    const { list: heroesFromStore } = useSelector((state: RootState) => state.heroes);
    const [allCharacters, setAllCharacters] = useState<Character[]>([]);
    const [sortBy, setSortBy] = useState<SortKey>('default');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const { t } = useTranslation();

    useEffect(() => {
        setAllCharacters(charactersData as Character[]);
    }, []);

    const unlockedCharacters = useMemo(() => {
        const unlockedHeroIds = new Set(heroesFromStore.filter(hero => hero.unlocked).map(hero => hero.id));
        return allCharacters.filter(char => unlockedHeroIds.has(char.id));
    }, [allCharacters, heroesFromStore]);

    const sortedCharacters = useMemo(() => {
        if (sortBy === 'default') {
            return [...unlockedCharacters];
        }

        const sorted = [...unlockedCharacters].sort((a, b) => {
            let valA: string | number = '';
            let valB: string | number = '';

            switch (sortBy) {
                case 'id':
                    valA = a.id;
                    valB = b.id;
                    break;
                case 'spec':
                    valA = a.spec;
                    valB = b.spec;
                    break;
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortOrder === 'asc' ? valA.localeCompare(b.id) : valB.localeCompare(a.id);
            }
            return 0;
        });
        return sorted;
    }, [unlockedCharacters, sortBy, sortOrder]);

    const heroes = useMemo(() => sortedCharacters.filter(c => !c.merc && !c.god), [sortedCharacters]);
    const mercenaries = useMemo(() => sortedCharacters.filter(c => c.merc), [sortedCharacters]);
    const gods = useMemo(() => sortedCharacters.filter(c => c.god), [sortedCharacters]);

    const handleSort = (key: SortKey) => {
        if (sortBy === key) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else {
                setSortBy('default');
                setSortOrder('asc'); // Reset to default order, and prepare for new sort
            }
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="characters-page">
            <CharacterTableSection
                title={t('characters.title_heroes')}
                characters={heroes}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
            <CharacterTableSection
                title={t('characters.title_mercenaries')}
                characters={mercenaries}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
            <CharacterTableSection
                title={t('characters.title_gods')}
                characters={gods}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
        </div>
    );
};

export default HeroTableList;
