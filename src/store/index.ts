import { configureStore } from '@reduxjs/toolkit';
import heroesReducer from './heroesSlice';

export const store = configureStore({
    reducer: {
        heroes: heroesReducer,
    },
});

// Déduire les types `RootState` et `AppDispatch` du store lui-même
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {heroes: HeroesState}
export type AppDispatch = typeof store.dispatch;