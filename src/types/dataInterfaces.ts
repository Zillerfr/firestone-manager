export interface Character {
    id: string;
    merc: boolean;
    god: boolean;
    spec: string;
    unlockStage: number;
}

export interface UpgradeEffects {
   gear: number[];
   jewel: number[];
   soulstone: number[];
}

export interface UpgradeCosts {
    gear: UpgradeCostsGear;
    jewel: UpgradeCostsJewel;
    soulstone: UpgradeCostsSoulstone;
}

export interface UpgradeCostsGear {
    tier1: number[];
    tier2: number[];
    tier3: number[];
}

export interface UpgradeCostsJewel {
    tier1: number[];
    tier2: number[];
}

export interface UpgradeCostsSoulstone {
    tier1: number[];
    tier2: number[];
}

export interface Upgrades {
    upgradeEffects: UpgradeEffects;
    upgradeCosts: UpgradeCosts;
}

export interface ItemTypes {
    id: string;
    nbTier : number;
}

export interface Speciality {
    id: string;
    wmStatBonus: WMStatBonus;
}

export interface WMStatBonus {
    damage : number;
    health : number;
    armor : number;
}

export interface WMStatBonus {
    id: string,
    merc: boolean,
    god: boolean,
    spec: string,
    unlockStage: number
}

export interface Rarity {
    id: string,
    maxLevel : number,
    hasSeal: boolean,
    baseEffectGear : BaseEffectGear, 
    baseEffectJewel : number,
    baseEffectSoulstone : BaseEffectSoulstone
}

export interface BaseEffectGear {
    tier1 : number,
    tier2 : number,
    ring : number,
    relic : number
}

export interface BaseEffectSoulstone {
    tier1 : number,
    wisdom : number,
    faith : number,
    charisma : number
}

export interface Gear {
    id: string,
    tier: number,
    position: number,
    effectBase: string,
    effectType: string,
    damage: number,
    health: number,
    resistance: number,
    gold: number
}

export interface Jewel {
    id: string,
    tier: number,
    position: number,
    effectType: string,
    damage: number,
    health: number,
    armor: number
}

export interface Soulstone {
    id: string,
    tier: number,
    position: number,
    effectBase: string,
    effectType: string,
    damage: number,
    health: number,
    resistance: number,
    firestones: number,
    gold: number
}

/*
Formulas

- Gear : https://firestone-idle-rpg.fandom.com/wiki/Gear
    effect = (rarities[itemRarity].baseEffectGear.[currentItem.rarityUpgrade] * gearUpgradeEffect[itemLevel] - 1) * 100%

    The gear power of a hero is given by 100 plus the sum of the power ratings of the hero gear.
    The base power of a tier 1/2/3 gear item is 100/150/250.
    The power doubles with every level increase and triples with every rarity increase:
        gear power = base power * 2level * 3(rarity - 1)

- Jewel : https://firestone-idle-rpg.fandom.com/wiki/Jewels
    effect = rarities[itemRarity].baseEffectJewel + jewelUpgradeEffect[jewelLevel]

    The jewel power of a hero is given by 100 plus the sum of the power ratings of the hero jewels.
    The base power of a tier 1/2 jewel item is 100/150.
    The power of a jewel doubles with every level increase and triples with every rarity increase:
        jewel power = base power * 2level * 3(rarity - 1)

- Soulstones : https://firestone-idle-rpg.fandom.com/wiki/Soulstones
    effect = (rarities[itemRarity].baseEffectSoulstone.[currentItem.rarityUpgrade] * soulStoneUpgradeEffect[itemLevel] - 1) * 100%

    The soulstone power of a hero is given by 100 plus the sum of the power ratings of the hero soulstones.
    The base power of a tier 1/2 soulstone is 100/250.
    The power of a soulstone doubles with every level increase and triples with every rarity increase:
        soulstone power = base power * 2level * 3(rarity - 1)

*/