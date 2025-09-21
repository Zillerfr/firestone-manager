import { configureStore } from '@reduxjs/toolkit';
import heroesReducer from './heroesSlice';
import warMachinesReducer from './warmachinesSlice';

export const store = configureStore({
    reducer: {
        heroes: heroesReducer,
        warMachines: warMachinesReducer,
    },
});

// Déduire les types `RootState` et `AppDispatch` du store lui-même
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {heroes: HeroesState, warMachines: WarMachinesState}
export type AppDispatch = typeof store.dispatch;
