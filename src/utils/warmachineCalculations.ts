/**
 * Calculates the total experience required to reach a specific level from level 1.
 * @param level The target level.
 * @returns The total experience required.
 */
export const calculateExperienceForLevel = (level: number): number => {
    if (level <= 1) { // Level 0 or 1 requires 0 experience
        return 0;
    }

    // Sum of an arithmetic progression: (n/2) * (2*a1 + (n-1)*d)
    // n = level - 1 (number of levels to sum XP for, from 1 to level-1)
    // a1 = 100 (XP needed from level 1 to 2)
    // d = 10 (common difference)
    const n = level - 1;
    const a1 = 100;
    const d = 10;

    return (n / 2) * (2 * a1 + (n - 1) * d);
};

/**
 * Calculates the total experience of a war machine based on its current level and current experience in that level.
 * @param level The current level of the war machine.
 * @param currentLevelExperience The experience accumulated in the current level.
 * @returns The total experience.
 */
export const calculateTotalExperience = (level: number, currentLevelExperience: number): number => {
    if (level <= 0) {
        return 0;
    }
    const xpToReachCurrentLevel = calculateExperienceForLevel(level);
    return xpToReachCurrentLevel + currentLevelExperience;
};

/**
 * Calculates the experience needed to reach the target level from the current total experience.
 * @param totalExperience The current total experience.
 * @param targetExperience The total experience required for the target level.
 * @returns The experience needed.
 */
export const calculateExperienceNeeded = (totalExperience: number, targetExperience: number): number => {
    return Math.max(0, targetExperience - totalExperience);
};

/**
 * Calculates the number of upgrades needed based on the experience needed.
 * Each upgrade gives 100 XP.
 * @param experienceNeeded The experience needed.
 * @returns The number of upgrades needed (integer, rounded up).
 */
export const calculateUpgradesNeeded = (experienceNeeded: number): number => {
    return Math.ceil(experienceNeeded / 100);
};

/**
 * Calculates the number of tokens needed based on the upgrades needed.
 * Each upgrade needs 500 tokens.
 * @param upgradesNeeded The number of upgrades needed.
 * @returns The number of tokens needed.
 */
export const calculateTokensNeeded = (upgradesNeeded: number): number => {
    return upgradesNeeded * 500;
};

/**
 * Calculates the number of screws needed based on the upgrades needed.
 * Each upgrade needs 20 screws.
 * @param upgradesNeeded The number of upgrades needed.
 * @returns The number of screws needed.
 */
export const calculateScrewsNeeded = (upgradesNeeded: number): number => {
    return upgradesNeeded * 20;
};

/**
 * Calculates the number of cogs needed based on the upgrades needed.
 * Each upgrade needs 12 cogs.
 * @param upgradesNeeded The number of upgrades needed.
 * @returns The number of cogs needed.
 */
export const calculateCogsNeeded = (upgradesNeeded: number): number => {
    return upgradesNeeded * 12;
};

/**
 * Calculates the number of metal needed based on the upgrades needed.
 * Each upgrade needs 1 metal.
 * @param upgradesNeeded The number of upgrades needed.
 * @returns The number of metal needed.
 */
export const calculateMetalNeeded = (upgradesNeeded: number): number => {
    return upgradesNeeded * 1;
};
