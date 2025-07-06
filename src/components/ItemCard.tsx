import React, { useState, useEffect, useRef } from 'react';
import type { HeroItem } from '../types/crudInterfaces';
import type { Gear, Jewel, Soulstone } from '../types/dataInterfaces';
import rarities from '../data/rarities.json';
import SealIcon from '../assets/icons/SealIcon';
import { useTranslation } from 'react-i18next';
import './ItemCard.css';


const itemImages = import.meta.glob('../assets/items/*.svg', { eager: true, as: 'url' });

const getItemImage = (id: string): string => {
    const imagePath = `../assets/items/${id}.svg`;
    if (itemImages[imagePath]) {
        return itemImages[imagePath] as string;
    }
    console.warn(`Image for item ${id}.svg not found at path: ${imagePath}`);
    return '';
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

interface ItemCardProps {
    item: Gear | Jewel | Soulstone;
    heroItem: HeroItem;
    itemType: 'gear' | 'jewel' | 'soulstone';
    onUpdate: (updatedHeroItem: HeroItem) => void;
    // NEW PROPS for shared state
    openDropdownItemId: string | null;
    setOpenDropdownItemId: (itemId: string | null) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, heroItem, itemType, onUpdate, openDropdownItemId, setOpenDropdownItemId }) => {
    const { t } = useTranslation();
    const currentRarity = rarities.find(r => r.id === heroItem.rarity);
    const currentLevel = heroItem.level;
    const selectedSeals = heroItem.unusedSeals || [];

    // REMOVE LOCAL showRarityDropdown STATE
    // const [showRarityDropdown, setShowRarityDropdown] = useState(false);

    // DETERMINE IF THIS SPECIFIC CARD'S DROPDOWN SHOULD BE SHOWN based on shared state
    const showRarityDropdown = openDropdownItemId === heroItem.id;

    // Use a single ref for the clickable container, or multiple as needed.
    // The previous 'dropdownRef' was actually pointing to 'selectContainerRef'
    const selectContainerRef = useRef<HTMLDivElement>(null);
    const optionsDropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only act if THIS card's dropdown is open AND the click is outside its container
            if (showRarityDropdown && selectContainerRef.current && !selectContainerRef.current.contains(event.target as Node)) {
                setOpenDropdownItemId(null); // Close it via parent's state
            }
        };
        // Add event listener to the document
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRarityDropdown, setOpenDropdownItemId]); // Add dependencies for stability

    useEffect(() => {
        if (showRarityDropdown && selectContainerRef.current && optionsDropdownRef.current) {
            const selectRect = selectContainerRef.current.getBoundingClientRect();
            const optionsRect = optionsDropdownRef.current.getBoundingClientRect();

            // The selector for your modal content. Make sure this is correct!
            const modalContainer = document.querySelector('.modal-content');

            let modalRect: DOMRect | { top: number; bottom: number; left: number; right: number; width: number; height: number; };

            if (modalContainer) {
                modalRect = modalContainer.getBoundingClientRect();
            } else {
                modalRect = {
                    top: 0,
                    bottom: window.innerHeight,
                    left: 0,
                    right: window.innerWidth,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            }

            let top = selectRect.height;
            let left = 0;

            const relativeTopInModal = selectRect.top - modalRect.top;
            const relativeLeftInModal = selectRect.left - modalRect.left;

            if ((relativeTopInModal + selectRect.height + optionsRect.height) > modalRect.height) {
                top = -(optionsRect.height);
            }

            if ((relativeLeftInModal + optionsRect.width) > modalRect.width) {
                left = selectRect.width - optionsRect.width;
            }

            setDropdownStyles({ top: `${top}px`, left: `${left}px` });
        } else {
            setDropdownStyles({});
        }
    }, [showRarityDropdown, item.id]); // Dependencies for re-calculation

    const notifyParent = (newRarityId: string, newLevel: number, newSeals: string[]) => {
        onUpdate({
            ...heroItem,
            rarity: newRarityId,
            level: newLevel,
            unusedSeals: newSeals
        });
    };

    const handleRarityChange = (rarityId: string) => {
        const newRarity = rarities.find(r => r.id === rarityId);
        if (newRarity) {
            const newLevel = Math.min(currentLevel, newRarity.maxLevel);

            const newRarityIndex = rarities.indexOf(newRarity);
            const filteredSeals = selectedSeals.filter(sealId => {
                const sealRarity = rarities.find(r => r.id === sealId);
                return sealRarity && rarities.indexOf(sealRarity) > newRarityIndex;
            });

            notifyParent(newRarity.id, newLevel, filteredSeals);
            setOpenDropdownItemId(null); // Close dropdown after selection
        }
    };

    const handleLevelChange = (delta: number) => {
        if (!currentRarity) return;
        const newLevel = Math.max(0, Math.min(currentRarity.maxLevel, currentLevel + delta));
        notifyParent(currentRarity.id, newLevel, selectedSeals);
    };

    const toggleSeal = (sealRarityId: string) => {
        const newSelectedSeals = selectedSeals.includes(sealRarityId)
            ? selectedSeals.filter(id => id !== sealRarityId)
            : [...selectedSeals, sealRarityId];
        notifyParent(currentRarity?.id || 'common', currentLevel, newSelectedSeals);
    };

    const applicableSeals = rarities.filter(r =>
        r.hasSeal && currentRarity && rarities.indexOf(r) > rarities.indexOf(currentRarity)
    );

    const itemImageUrl = getItemImage(item.id);

    return (
        <div className={`data-item-${itemType}-tier${item.tier}-${item.id} data-item-container`}>
            <div className="item-main-block">
                <div
                    className={`custom-select-container item-selector color-${currentRarity ? currentRarity.id : 'none'}`}
                    onClick={() => {
                        // Toggle this item's dropdown via the parent state
                        setOpenDropdownItemId(showRarityDropdown ? null : heroItem.id);
                    }}
                    ref={selectContainerRef}
                >
                    <img className={`item-svg select-image color-${currentRarity ? currentRarity.id : 'none'}`} src={itemImageUrl} alt={item.id} />

                    {showRarityDropdown && ( // Now showRarityDropdown is derived from parent state
                        <div
                            className={`custom-options data-item-data-grid data-item-data-grid-${itemType}`}
                            ref={optionsDropdownRef}
                            style={dropdownStyles}
                            onClick={(e) => e.stopPropagation()} // Prevent closing immediately after selection
                        >
                            {rarities.map(r => (
                                <div
                                    key={r.id}
                                    data-value={r.id}
                                    className="option-container"
                                    onClick={(e) => { e.stopPropagation(); handleRarityChange(r.id); }}
                                >
                                    <div className={`option color-${r.id}`}><img className={`item-svg color-${r.id}`} src={itemImageUrl} alt={r.id} /></div>
                                    <div className="rarity-name">{capitalizeFirstLetter(r.id)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={`input-with-control vertical-control border-color-${currentRarity ? currentRarity.id : 'none'}`}>
                    <button className="value-control" onClick={() => handleLevelChange(1)}>+</button>
                    <div className="level-display">{currentLevel}</div>
                    <button className="value-control" onClick={() => handleLevelChange(-1)}>-</button>
                </div>
            </div>

            {applicableSeals.length > 0 && (
                <div className="seals-container">
                    {applicableSeals.map(sealRarity => (
                        <div
                            key={sealRarity.id}
                            className={`seal-item rarity-${sealRarity.id} ${selectedSeals.includes(sealRarity.id) ? 'selected' : ''}`}
                            onClick={() => toggleSeal(sealRarity.id)}
                            title={t(`seals.${sealRarity.id}`)}
                        >
                            <SealIcon />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemCard;