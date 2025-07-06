import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Hero } from '../types/crudInterfaces';
import type { Character } from '../types/dataInterfaces'; // Assurez-vous que WarMachine n'est PAS importé d'ici
import { calculateHeroWMStats } from '../utils/calculateHeroWMStats'; // <--- AJOUTEZ CET IMPORT

// Import des données statiques
import charactersData from '../data/characters.json';
import warMachineList from '../data/warmachineList.json'; // Ceci est un Array<string>

// Import des sous-composants
import CrewTable from './CrewTable';

import './WarMachineCrewArray.css';
import defaultTankIcon from '../assets/icons/tank.svg';

// Helpers pour les images
const characterImages = import.meta.glob('../assets/characters/*.webp', { eager: true, as: 'url' });
const getCharacterImage = (id: string): string => {
    const imagePath = `../assets/characters/${id}.webp`;
    if (characterImages[imagePath]) {
        return characterImages[imagePath] as string;
    }
    // console.warn(`Character image for ${id}.webp not found.`);
    return ''; // Ou une image par défaut
};

const machineImages = import.meta.glob('../assets/machines/*.webp', { eager: true, as: 'url' });
const getMachineImage = (id: string): string => {
    if (id === 'none') {
        return defaultTankIcon;
    }
    const imagePath = `../assets/machines/${id}.webp`;
    if (machineImages[imagePath]) {
        return machineImages[imagePath] as string;
    }
    // console.warn(`War Machine image for ${id}.webp not found.`);
    return ''; // Ou une image par défaut
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};


// Définition des types pour le tri
export type SortKey = 'characterName' | 'spec' | 'warMachineName' | 'dmg' | 'potentialDmg' | 'health' | 'potentialHealth' | 'resist' | 'potentialResist' | 'healthResist' | 'potentialHealthResist';
type SortOrder = 'asc' | 'desc';

export interface CombinedHeroData {
    hero: Hero;
    characterInfo: Character;
    warMachineInfo: string | null;
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
}

const WarMachineCrewArray: React.FC = () => {
    // Si l'erreur persiste sur 'state.heroes', vérifiez RootState et heroesSlice.ts
    // Assurez-vous que votre heroesSlice.ts a bien:
    // interface HeroesState { heroes: Hero[]; }
    // const initialState: HeroesState = { heroes: [] };
    // Et que votre RootState dans store/index.ts est déduit correctement.
    const { list: heroes } = useSelector((state: RootState) => state.heroes);
    const [sortBy, setSortBy] = useState<SortKey>('characterName');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Prépare les données en combinant Hero, Character et WarMachine
    const combinedHeroData: CombinedHeroData[] = useMemo(() => {
        return heroes
            .filter(hero => hero.unlocked) // Seulement les personnages débloqués
            .map(hero => {
                const characterInfo = charactersData.find(char => char.id === hero.id);
                // Vérifie si la warMachine du héros est dans notre liste ou est 'none'
                const warMachineId = hero.warMachine === 'none' || warMachineList.includes(hero.warMachine)
                                     ? hero.warMachine
                                     : null; // Si l'ID n'est pas 'none' et n'est pas dans la liste, c'est null

                if (!characterInfo) {
                    console.warn(`Character data not found for hero ID: ${hero.id}`);
                    return null; // Ignore les héros sans données de personnage
                }

                // Calculer les stats ici
                const calculatedStats = calculateHeroWMStats(hero);

                return {
                    hero,
                    characterInfo,
                    warMachineInfo: warMachineId,
                    characterName: capitalizeFirstLetter(hero.id),
                    spec: characterInfo.spec,
                    health: calculatedStats.health,
                    potentialHealth: calculatedStats.potentialHealth,
                    dmg: calculatedStats.dmg,
                    potentialDmg: calculatedStats.potentialDmg,
                    resist: calculatedStats.resist,
                    potentialResist: calculatedStats.potentialResist,
                    healthResist: calculatedStats.healthResist,
                    potentialHealthResist: calculatedStats.potentialHealthResist
                };
            })
            .filter((item): item is CombinedHeroData => item !== null);
    }, [heroes]);

    // Logique de tri
    const sortedHeroes = useMemo(() => {
        const sorted = [...combinedHeroData].sort((a, b) => {
            let valA: string | number | boolean;
            let valB: string | number | boolean;

            switch (sortBy) {
                case 'characterName':
                    valA = a.characterName;
                    valB = b.characterName;
                    break;
                case 'spec':
                    valA = a.spec;
                    valB = b.spec;
                    break;
                case 'warMachineName':
                    valA = a.hero.warMachine;
                    valB = b.hero.warMachine;
                    break;
                case 'health':
                    valA = a.health;
                    valB = b.health;
                    break;
                case 'potentialHealth':
                    valA = a.potentialHealth;
                    valB = b.potentialHealth;
                    break;                    
                case 'dmg':
                    valA = a.dmg;
                    valB = b.dmg;
                    break;                    
                case 'potentialDmg':
                    valA = a.potentialDmg;
                    valB = b.potentialDmg;
                    break;                    
                case 'resist':
                    valA = a.resist;
                    valB = b.resist;
                    break;                    
                case 'potentialResist':
                    valA = a.potentialResist;
                    valB = b.potentialResist;
                    break;                    
                case 'healthResist':
                    valA = a.healthResist;
                    valB = b.healthResist;
                    break;                    
                case 'potentialHealthResist':
                    valA = a.potentialHealthResist;
                    valB = b.potentialHealthResist;
                    break;                    

                    break;
                default:
                    valA = a.characterName; // Fallback par défaut
                    valB = b.characterName;
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            // Si c'est numérique, la comparaison est différente
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });
        return sorted;
    }, [combinedHeroData, sortBy, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc'); // Par défaut, tri ascendant pour une nouvelle colonne
        }
    };

    return (
        <div className="war-machine-crew-array">
            <CrewTable
                heroes={sortedHeroes}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                getCharacterImage={getCharacterImage}
                getMachineImage={getMachineImage}
                capitalizeFirstLetter={capitalizeFirstLetter}
            />
        </div>
    );
};

export default WarMachineCrewArray;