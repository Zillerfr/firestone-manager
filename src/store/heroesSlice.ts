import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { heroService } from '../services/heroService';
import type { Hero, HeroItem } from '../types/crudInterfaces';
import gears from '../data/gears.json'; // Importez les données d'items
import jewels from '../data/jewels.json'; // Importez les données d'items
import soulstones from '../data/soulstones.json'; // Importez les données d'items

// Définir l'interface de l'état de notre slice
interface HeroesState {
    list: Hero[];
    selectedHero: Hero | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// État initial
const initialState: HeroesState = {
    list: [],
    selectedHero: null,
    status: 'idle',
    error: null,
};

// Fonction utilitaire pour générer les HeroItems par défaut pour un type donné
const getDefaultHeroItems = (
    allItems: { id: string; tier: number; position: number }[] // Utilise un type générique pour les items de référence
): HeroItem[] => {
    return allItems.map(item => ({
        id: item.id,
        rarity: 'none', // Rareté par défaut
        level: 0,
        unusedSeals: [],
    }));
};

// Fonction utilitaire pour garantir que les listes d'items d'un héros sont complètes
// Cette fonction prend un objet Hero et retourne une nouvelle instance de Hero avec des listes complètes.
const ensureFullHeroItems = (hero: Hero): Hero => {
    const defaultGear = getDefaultHeroItems(gears);
    const defaultJewel = getDefaultHeroItems(jewels);
    const defaultSoulstone = getDefaultHeroItems(soulstones);

    // Crée un Map pour un accès rapide aux items existants du héros
    const existingGearMap = new Map(hero.gear.map(item => [item.id, item]));
    const existingJewelMap = new Map(hero.jewel.map(item => [item.id, item]));
    const existingSoulstoneMap = new Map(hero.soulstone.map(item => [item.id, item]));

    // Fusionne les items par défaut avec les items existants du héros
    const mergedGear = defaultGear.map(defaultItem => {
        const existingItem = existingGearMap.get(defaultItem.id);
        return existingItem ? { ...existingItem } : defaultItem; // Retourne l'existant (cloné) ou le défaut
    });

    const mergedJewel = defaultJewel.map(defaultItem => {
        const existingItem = existingJewelMap.get(defaultItem.id);
        return existingItem ? { ...existingItem } : defaultItem;
    });

    const mergedSoulstone = defaultSoulstone.map(defaultItem => {
        const existingItem = existingSoulstoneMap.get(defaultItem.id);
        return existingItem ? { ...existingItem } : defaultItem;
    });

    return {
        ...hero, // Garde toutes les autres propriétés du héros
        gear: mergedGear,
        jewel: mergedJewel,
        soulstone: mergedSoulstone,
    };
};

// Fonction utilitaire pour créer un héros par défaut
const createDefaultHero = (id: string): Hero => {
    return {
        id: id,
        unlocked: false,
        warMachine: 'none',
        // Initialisez les listes d'items avec tous les items possibles par défaut
        gear: getDefaultHeroItems(gears),
        jewel: getDefaultHeroItems(jewels),
        soulstone: getDefaultHeroItems(soulstones),
    };
};

// Async Thunks (inchangés sauf pour fetchHeroById.fulfilled)
export const fetchHeroes = createAsyncThunk<Hero[], void, { rejectValue: string }>(
    'heroes/fetchHeroes',
    async (_, { rejectWithValue }) => {
        try {
            const heroes = await heroService.getAllHeroes();
            // Optionnel: vous pourriez aussi "réparer" tous les héros ici si vous voulez que la liste principale soit aussi complète.
            // return heroes.map(ensureFullHeroItems);
            return heroes;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchHeroById = createAsyncThunk<Hero, string, { rejectValue: string }>(
    'heroes/fetchHeroById',
    async (heroId, { rejectWithValue }) => {
        try {
            const hero = await heroService.getHeroById(heroId);
            if (!hero) {
                console.warn(`Hero with ID ${heroId} not found. Creating a default hero.`);
                return createDefaultHero(heroId); // Si non trouvé, crée un héros complet par défaut
            }
            // Si le héros est trouvé, assurez-vous que ses listes d'objets sont complètes
            return ensureFullHeroItems(hero); // <--- NOUVEAU : Complète les listes ici
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveHero = createAsyncThunk<Hero, Hero, { rejectValue: string }>(
    'heroes/saveHero',
    async (heroData, { rejectWithValue }) => {
        try {
            const savedHero = await heroService.saveHero(heroData);
            return savedHero;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        clearSelectedHero: (state) => {
            state.selectedHero = null;
        },
        updateSelectedHeroLocal: (state, action: PayloadAction<Partial<Hero>>) => {
            if (state.selectedHero) {
                state.selectedHero = { ...state.selectedHero, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchHeroes.fulfilled, (state, action: PayloadAction<Hero[]>) => {
                state.status = 'succeeded';
                state.list = action.payload; // La liste est gérée ici. Si vous voulez réparer TOUS les héros de la liste principale, faites un map(ensureFullHeroItems) dans le thunk fetchHeroes.
            })
            .addCase(fetchHeroes.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || 'Une erreur inconnue est survenue';
            })
            .addCase(fetchHeroById.pending, (state) => {
                state.status = 'loading';
                state.selectedHero = null;
                state.error = null;
            })
            .addCase(fetchHeroById.fulfilled, (state, action: PayloadAction<Hero>) => {
                state.status = 'succeeded';
                // L'action.payload est déjà un héros "réparé" ou par défaut
                state.selectedHero = { ...action.payload }; // Cloné pour s'assurer d'une nouvelle référence dans le store
            })
            .addCase(fetchHeroById.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || 'Une erreur inconnue est survenue';
                state.selectedHero = null;
            })
            .addCase(saveHero.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(saveHero.fulfilled, (state, action: PayloadAction<Hero>) => {
                state.status = 'succeeded';
                const savedHero = action.payload;
                const existingIndex = state.list.findIndex(hero => hero.id === savedHero.id);
                // Assurez-vous que le héros sauvegardé est aussi "réparé" avant de l'ajouter/mettre à jour dans la liste
                const fullySavedHero = ensureFullHeroItems(savedHero); // <--- NOUVEAU : Réparer le héros sauvegardé aussi

                if (existingIndex !== -1) {
                    state.list[existingIndex] = { ...fullySavedHero };
                } else {
                    state.list.push({ ...fullySavedHero });
                }
                state.selectedHero = { ...fullySavedHero };
            });
    },
});

export const { clearSelectedHero, updateSelectedHeroLocal } = heroesSlice.actions;
export default heroesSlice.reducer;