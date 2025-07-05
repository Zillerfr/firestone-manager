export interface Hero {
    id: string,
    unlocked: boolean,
    warMachine: string,
    gear: HeroItem[],
    jewel: HeroItem[],
    soulstone: HeroItem[]
}

export interface HeroItem {
    id: string,
    rarity: string,
    level: number,
    unusedSeals: string[]
}