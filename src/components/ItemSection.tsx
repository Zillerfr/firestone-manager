import React from 'react';
import type { HeroItem } from '../types/crudInterfaces';
import type { ItemTypes, Gear, Jewel, Soulstone } from '../types/dataInterfaces';
import ItemCard from './ItemCard';

import './ItemSection.css';

interface ItemSectionProps {
    title: string;
    itemType: 'gear' | 'jewel' | 'soulstone';
    heroItems: HeroItem[];
    allItems: (Gear | Jewel | Soulstone)[];
    itemTypeInfo: ItemTypes;
    onItemChange: (itemType: 'gear' | 'jewel' | 'soulstone', updatedItem: HeroItem) => void;
    // NEW PROPS for shared state
    openDropdownItemId: string | null;
    setOpenDropdownItemId: (itemId: string | null) => void;
}

const ItemSection: React.FC<ItemSectionProps> = ({
    title,
    itemType,
    heroItems,
    allItems,
    itemTypeInfo,
    onItemChange,
    openDropdownItemId, // Receive shared state
    setOpenDropdownItemId, // Receive setter
}) => {
    const categorizedItems: { [tier: number]: { [position: number]: HeroItem | null } } = {};

    for (let i = 1; i <= itemTypeInfo.nbTier; i++) {
        categorizedItems[i] = {};
        const itemsInTier = allItems.filter(item => item.tier === i);
        itemsInTier.forEach(item => {
            categorizedItems[i][item.position] = null;
        });
    }

    heroItems.forEach(hItem => {
        const fullItem = allItems.find(aItem => aItem.id === hItem.id);
        if (fullItem) {
            if (!categorizedItems[fullItem.tier]) {
                categorizedItems[fullItem.tier] = {};
            }
            categorizedItems[fullItem.tier][fullItem.position] = { ...hItem };
        }
    });

    const sortedTiers = Array.from({ length: itemTypeInfo.nbTier }, (_, i) => i + 1).reverse();

    return (
        <div className="item-section">
            <h3>{title}</h3>
            <div className="item-tiers-container">
                {sortedTiers.map(tier => {
                    const itemsInTier = Object.entries(categorizedItems[tier] || {})
                        .sort(([posA], [posB]) => parseInt(posA) - parseInt(posB))
                        .map(([position, hItem]) => {
                            const fullItem = allItems.find(aItem => aItem.tier === tier && aItem.position === parseInt(position));
                            if (!fullItem) return null;

                            const currentHeroItem: HeroItem = hItem || {
                                id: fullItem.id,
                                rarity: 'common',
                                level: 0,
                                unusedSeals: []
                            };

                            return (
                                <ItemCard
                                    key={`${itemType}-${fullItem.id}`}
                                    item={fullItem}
                                    heroItem={currentHeroItem}
                                    itemType={itemType}
                                    onUpdate={updatedItem => onItemChange(itemType, updatedItem)}
                                    openDropdownItemId={openDropdownItemId} // Pass shared state to ItemCard
                                    setOpenDropdownItemId={setOpenDropdownItemId} // Pass setter to ItemCard
                                />
                            );
                        });

                    const filteredItems = itemsInTier.filter(Boolean);

                    return (
                        <div key={tier} className={`item-tier tier-${tier}`}>
                            <div className={`item-tier-row items-${filteredItems.length}`}>
                                {filteredItems}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ItemSection;