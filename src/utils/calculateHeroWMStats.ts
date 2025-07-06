// src/utils/calculateHeroWMStats.ts
import type { Hero } from '../types/crudInterfaces';
import type { Rarity } from '../types/dataInterfaces';

// Importez directement les données pour cette fonction utilitaire si elle doit être autonome
import jewelsData from '../data/jewels.json';
import raritiesData from '../data/rarities.json';
import specialitiesData from '../data/specialities.json';
import upgradesData from '../data/upgrades.json';
import charactersData from '../data/characters.json'; 

// Définir une interface pour les résultats du calcul
export interface CalculatedStats {
    health: number;
    potentialHealth: number;
    dmg: number; // À ajouter plus tard
    potentialDmg: number; // À ajouter plus tard
    resist: number; // À ajouter plus tard
    potentialResist: number; // À ajouter plus tard
    healthResist: number; // À ajouter plus tard
    potentialHealthResist: number; // À ajouter plus tard
}

// Fonction utilitaire pour trouver la rareté suivante
// Cette fonction est une supposition basée sur une progression typique des raretés (ex: Common -> Uncommon -> Rare, etc.)
// Vous devrez peut-être ajuster cette logique si l'ordre des raretés n'est pas simple.
// Pour l'exemple, supposons que `raritiesData` est trié ou que nous avons un moyen de trouver "next".
const getNextRarity = (currentRarityId: string, allRarities: Rarity[]): Rarity | undefined => {
    const rarityOrder = [
        "common", "uncommon", "rare", "epic", "legendary", "mythic", "titan", "angel"
        // ... ajoutez toutes vos raretés dans l'ordre de progression
    ];
    const currentIndex = rarityOrder.indexOf(currentRarityId);
    if (currentIndex === -1 || currentIndex >= rarityOrder.length - 1) {
        return undefined; // Pas de rareté suivante ou rareté inconnue
    }
    const nextRarityId = rarityOrder[currentIndex + 1];
    return allRarities.find(r => r.id === nextRarityId);
};


export const calculateHeroWMStats = (hero: Hero): CalculatedStats => {
    let damageBoost = 0;
    let maxDamageBoost = 0;
    let healthBoost = 0;
    let maxHealthBoost = 0;
    let armorBoost = 0;
    let maxArmorBoost = 0;

    // 1. charHealthBonus
    // Étape 1a: Trouver le personnage dans characters.json pour obtenir sa spécialisation
    const characterInfo = charactersData.find(char => char.id === hero.id);
        if (!characterInfo) {
        console.warn(`Character info not found for hero ID: ${hero.id}. Cannot apply speciality bonus.`);
        // Si le personnage n'est pas trouvé, on ne peut pas appliquer le bonus de spécialisation.
        // On pourrait retourner des stats de base ou gérer cette erreur selon la logique désirée.
        // Pour l'instant, on assume 0 bonus si non trouvé.
    }
    
    // Étape 1b: Utiliser la spécialisation pour trouver le bonus dans specialities.json
    const speciality = specialitiesData.find(s => s.id === characterInfo?.spec);
    const charDamageBonus = 1 + ((speciality?.wmStatBonus.damage || 0) / 100);
    const charHealthBonus = 1 + ((speciality?.wmStatBonus.health || 0) / 100);
    const charArmorBonus = 1 + ((speciality?.wmStatBonus.armor || 0) / 100);

    // 2. Pour chaque bijou équipé sur le personnage
    hero.jewel.forEach(equippedJewel => {
        const jewelInfo = jewelsData.find(j => j.id === equippedJewel.id);
        if (!jewelInfo) {
            console.warn(`Jewel info not found for ID: ${equippedJewel.id}`);
            return;
        }

        const jewelRarity = raritiesData.find(r => r.id === equippedJewel.rarity);
        if (!jewelRarity) {
            console.warn(`Rarity info not found for ID: ${equippedJewel.rarity}`);
            return;
        }

        const jewelLevel = equippedJewel.level;
        const jewelDamageMultiplier = jewelInfo.damage > 0 ? 1 : 0;
        const jewelHealthMultiplier = jewelInfo.health > 0 ? 1 : 0;
        const jewelArmorMultiplier = jewelInfo.armor > 0 ? 1 : 0;

        // Commençons avec la rareté actuelle du bijou comme point de départ pour la "rareté maximale accessible"
        let currentMaxAccessibleRarity: Rarity = jewelRarity;
        
        // Nous allons itérer tant qu'il y a une rareté suivante ET que le personnage possède le sceau pour cette rareté.
        let nextRarityCandidate = getNextRarity(currentMaxAccessibleRarity.id, raritiesData as Rarity[]);

        while (nextRarityCandidate && equippedJewel.unusedSeals.includes(nextRarityCandidate.id)) {
            // Si le sceau est possédé, cette rareté devient la nouvelle "rareté maximale accessible"
            currentMaxAccessibleRarity = nextRarityCandidate;
            // Et nous cherchons la rareté suivante par rapport à cette nouvelle rareté
            nextRarityCandidate = getNextRarity(currentMaxAccessibleRarity.id, raritiesData as Rarity[]);
        }

        // Une fois la boucle terminée, currentMaxAccessibleRarity est la rareté la plus élevée
        // que le bijou peut atteindre avec les sceaux possédés.

        // Utilisez cette rareté unique pour déterminer JewelMaxLevel et jewelMaxRarityEffect
        const JewelMaxLevel = currentMaxAccessibleRarity.maxLevel;
        const jewelMaxRarityEffect = currentMaxAccessibleRarity.baseEffectJewel;

        // --- FIN DE LA LOGIQUE CONSOLIDÉE ---
        
        // Le reste des calculs utilise ces valeurs
        const jewelUpgradeEffect = (upgradesData.upgradeEffects.jewel[jewelLevel] || 0);
        const jewelMaxUpgradeEffect = (upgradesData.upgradeEffects.jewel[JewelMaxLevel] || 0);
        
        const jewelRarityEffect = jewelRarity.baseEffectJewel; // Ceci est toujours basé sur la rareté ÉQUIPÉE, pas la maximale accessible

        const jewelEffect = jewelRarityEffect + jewelUpgradeEffect;
        const jewelMaxEffect = jewelMaxRarityEffect + jewelMaxUpgradeEffect;

        if (equippedJewel.rarity !== 'none') {
            const currentJewelDamageBoost = jewelDamageMultiplier * jewelEffect;
            const currentJewelMaxDamageBoost = jewelDamageMultiplier * jewelMaxEffect;
            const currentJewelHealthBoost = jewelHealthMultiplier * jewelEffect;
            const currentJewelMaxHealthBoost = jewelHealthMultiplier * jewelMaxEffect;
            const currentJewelArmorBoost = jewelArmorMultiplier * jewelEffect;
            const currentJewelMaxArmorBoost = jewelArmorMultiplier * jewelMaxEffect;

            damageBoost += currentJewelDamageBoost;
            maxDamageBoost += currentJewelMaxDamageBoost;
            healthBoost += currentJewelHealthBoost;
            maxHealthBoost += currentJewelMaxHealthBoost;
            armorBoost += currentJewelArmorBoost;
            maxArmorBoost += currentJewelMaxArmorBoost;
        }
    });

    // Multiplier par le bonus de spécialisation
    damageBoost *= charDamageBonus;
    maxDamageBoost *= charDamageBonus;
    healthBoost *= charHealthBonus;
    maxHealthBoost *= charHealthBonus;
    armorBoost *= charArmorBonus;
    maxArmorBoost *= charArmorBonus;

    return {
        health: healthBoost,
        potentialHealth: maxHealthBoost,
        dmg: damageBoost,
        potentialDmg: maxDamageBoost,
        resist: armorBoost,
        potentialResist: maxArmorBoost,
        healthResist: healthBoost + armorBoost,
        potentialHealthResist: maxHealthBoost + maxArmorBoost
    };
};