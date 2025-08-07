import { useDispatch, useSelector } from 'react-redux';
import type { Character } from '../types/dataInterfaces';
import type { HeroItem } from '../types/crudInterfaces';
import { saveHero } from '../store/heroesSlice';
import type { AppDispatch, RootState } from '../store';

import ItemSection from './ItemSection';
import WarMachineSelector from './WarMachineSelector';

import gears from '../data/gears.json';
import jewels from '../data/jewels.json';
import soulstones from '../data/soulstones.json';
import itemTypes from '../data/itemTypes.json';
import warMachineList from '../data/warmachineList.json';
import { useState } from 'react';
import React from 'react';

const characterImages = import.meta.glob('../assets/characters/*.webp', { eager: true, as: 'url' });
const getCharacterImage = (id: string): string => {
    const imagePath = `../assets/characters/${id}.webp`;
    if (characterImages[imagePath]) {
        return characterImages[imagePath] as string;
    }
    return '';
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

interface CharacterTableRowProps {
    character: Character;
}

const CharacterTableRow: React.FC<CharacterTableRowProps> = ({ character }) => {
    const dispatch: AppDispatch = useDispatch();
    const [openDropdownItemId, setOpenDropdownItemId] = useState<string | null>(null);

    // Fetch the hero data directly from the Redux store
    const hero = useSelector((state: RootState) =>
        state.heroes.list.find(h => h.id === character.id)
    );

    // If hero data is not found (e.g., not unlocked), don't render the row
    if (!hero) {
        return null;
    }

    const handleItemChange = async (itemType: 'gear' | 'jewel' | 'soulstone', updatedItem: HeroItem) => {
        const newItemsArray = hero[itemType].map(item =>
            item.id === updatedItem.id ? { ...updatedItem } : item
        );
        const updatedHero = {
            ...hero,
            [itemType]: newItemsArray,
        };
        await dispatch(saveHero(updatedHero));
    };

    const handleWarMachineChange = async (selectedWarMachineId: string) => {
        const updatedHero = {
            ...hero,
            warMachine: selectedWarMachineId,
        };
        await dispatch(saveHero(updatedHero));
    };

    const gearType = itemTypes.find(type => type.id === 'gear');
    const jewelType = itemTypes.find(type => type.id === 'jewel');
    const soulstoneType = itemTypes.find(type => type.id === 'soulstone');

    return (
        <tr>
            <td>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={getCharacterImage(character.id)} alt={character.id} style={{ width: '50px', height: '50px' }} />
                    <span>{capitalizeFirstLetter(character.id)}</span>
                </div>
            </td>
            <td>
                {gearType && (
                    <ItemSection
                        title=""
                        itemType="gear"
                        heroItems={hero.gear}
                        allItems={gears}
                        itemTypeInfo={gearType}
                        onItemChange={handleItemChange}
                        openDropdownItemId={openDropdownItemId}
                        setOpenDropdownItemId={setOpenDropdownItemId}
                    />
                )}
            </td>
            <td>
                {jewelType && (
                    <ItemSection
                        title=""
                        itemType="jewel"
                        heroItems={hero.jewel}
                        allItems={jewels}
                        itemTypeInfo={jewelType}
                        onItemChange={handleItemChange}
                        openDropdownItemId={openDropdownItemId}
                        setOpenDropdownItemId={setOpenDropdownItemId}
                    />
                )}
            </td>
            <td>
                {soulstoneType && (
                    <ItemSection
                        title=""
                        itemType="soulstone"
                        heroItems={hero.soulstone}
                        allItems={soulstones}
                        itemTypeInfo={soulstoneType}
                        onItemChange={handleItemChange}
                        openDropdownItemId={openDropdownItemId}
                        setOpenDropdownItemId={setOpenDropdownItemId}
                    />
                )}
            </td>
            <td>
                <WarMachineSelector
                    currentWarMachineId={hero.warMachine}
                    warMachineOptions={warMachineList}
                    onChange={handleWarMachineChange}
                />
            </td>
        </tr>
    );
};

export default React.memo(CharacterTableRow);
