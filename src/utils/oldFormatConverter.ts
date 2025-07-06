// src/utils/oldFormatConverter.ts

import type { Hero, HeroItem } from '../types/crudInterfaces';

const RARITY_MAP = ["none", "common", "uncommon", "rare", "epic", "legendary", "mythic", "titan", "angel"];
const WAR_MACHINE_MAP = ["none", "goliath", "fortress", "earthshatterer", "sentinel", "hunter", "curator", "thunderclap", "judgement", "harvester", "talos", "firecracker", "cloudfist", "aegis"];

const GEAR_ITEM_TYPES = ["weapon", "chest", "boots", "wrist", "shoulder", "belt", "ring", "relic"];
const JEWEL_ITEM_TYPES = ["ankh", "rune", "idol", "talisman", "necklace", "trinket"];
const SOULSTONE_ITEM_TYPES = ["focus", "stamina", "courage", "wisdom", "faith", "charisma"];

/**
 * Converts data from the old JSON format to an array of Hero objects.
 * @param oldData The JSON object representing the old data format.
 * @returns An array of Hero objects in the new format.
 */
export const convertOldDataToNewHeroes = (oldData: Record<string, any>): Hero[] => {
    const newHeroesMap = new Map<string, Hero>();

    // Step 1: Populate the map with initial hero data, including items
    for (const key in oldData) {
        if (Object.prototype.hasOwnProperty.call(oldData, key)) {
            const value = oldData[key];
            const parts = key.split('-');

            if (parts.length < 2) {
                continue;
            }

            const heroId = parts[0];
            
            // Ensure the hero exists in our map, create if not
            // Initialize 'unlocked' to false by default, we'll set it to true later if conditions are met
            if (!newHeroesMap.has(heroId)) {
                newHeroesMap.set(heroId, {
                    id: heroId,
                    unlocked: false, // Default to false
                    warMachine: 'none',
                    gear: [],
                    jewel: [],
                    soulstone: []
                });
            }

            const currentHero = newHeroesMap.get(heroId)!;

            // Handle War Machine assignment
            if (parts[1] === 'WM') {
                const wmIndex = value as number;
                if (wmIndex >= 0 && wmIndex < WAR_MACHINE_MAP.length) {
                    currentHero.warMachine = WAR_MACHINE_MAP[wmIndex];
                } else {
                    console.warn(`Invalid War Machine index for ${heroId}: ${wmIndex}. Defaulting to 'none'.`);
                }
                // No 'unlocked' condition based on WM, so continue processing other items for this hero
                continue; 
            }

            // Handle gear, jewel, and soulstone items
            if (parts.length === 4) {
                const itemCategory = parts[1];
                const itemType = parts[2];
                const property = parts[3];

                let targetArray: HeroItem[] | undefined;
                let expectedItemTypes: string[] = [];

                switch (itemCategory) {
                    case 'gears':
                        targetArray = currentHero.gear;
                        expectedItemTypes = GEAR_ITEM_TYPES;
                        break;
                    case 'jewels':
                        targetArray = currentHero.jewel;
                        expectedItemTypes = JEWEL_ITEM_TYPES;
                        break;
                    case 'soulstones':
                        targetArray = currentHero.soulstone;
                        expectedItemTypes = SOULSTONE_ITEM_TYPES;
                        break;
                    default:
                        console.warn(`Unknown item category: ${itemCategory} for ${key}`);
                        continue;
                }

                if (!targetArray || !expectedItemTypes.includes(itemType)) {
                    console.warn(`Invalid item type ${itemType} for category ${itemCategory} in key: ${key}`);
                    continue;
                }

                let item = targetArray.find(i => i.id === itemType);
                if (!item) {
                    item = {
                        id: itemType,
                        rarity: 'none',
                        level: 0,
                        unusedSeals: []
                    };
                    targetArray.push(item);
                }

                if (property === 'rarity') {
                    const rarityIndex = value as number;
                    if (rarityIndex >= 0 && rarityIndex < RARITY_MAP.length) {
                        item.rarity = RARITY_MAP[rarityIndex];
                    } else {
                        console.warn(`Invalid rarity index for ${heroId}-${itemType}: ${rarityIndex}. Defaulting to 'none'.`);
                        item.rarity = 'none';
                    }
                } else if (property === 'level') {
                    item.level = value as number;
                } else {
                    console.warn(`Unknown property '${property}' for item ${itemType} in key: ${key}`);
                }
            }
        }
    }

    // Step 2: Iterate through the collected heroes and set 'unlocked' based on the rarity condition
    const finalHeroes: Hero[] = [];
    for (const hero of newHeroesMap.values()) {
        let hasNonNoneRarityItem = false;

        // Check gear items
        if (hero.gear.some(item => item.rarity !== 'none')) {
            hasNonNoneRarityItem = true;
        }
        // Check jewel items
        if (!hasNonNoneRarityItem && hero.jewel.some(item => item.rarity !== 'none')) {
            hasNonNoneRarityItem = true;
        }
        // Check soulstone items
        if (!hasNonNoneRarityItem && hero.soulstone.some(item => item.rarity !== 'none')) {
            hasNonNoneRarityItem = true;
        }

        // Set the unlocked status
        hero.unlocked = hasNonNoneRarityItem;
        finalHeroes.push(hero);
    }

    return finalHeroes;
};