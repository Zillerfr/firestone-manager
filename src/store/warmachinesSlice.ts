import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { warMachineService } from '../services/warmachineService';
import type { WarMachine } from '../types/crudInterfaces';
import warMachineListData from '../data/warmachineList.json';

// Define the interface for our slice's state
interface WarMachinesState {
    list: WarMachine[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: WarMachinesState = {
    list: [],
    status: 'idle',
    error: null,
};

// Helper function to create a default war machine
const createDefaultWarMachine = (id: string): WarMachine => {
    return {
        id: id,
        level: 0,
        experience: 0,
        targetLevel: 0, // Add targetLevel
    };
};

// Async Thunks
export const fetchWarMachines = createAsyncThunk<WarMachine[], void, { rejectValue: string }>(
    'warMachines/fetchWarMachines',
    async (_, { rejectWithValue }) => {
        try {
            const storedWarMachines = await warMachineService.getAllWarMachines();
            const storedWarMachinesMap = new Map(storedWarMachines.map(wm => [wm.id, wm]));
            
            const allWarMachines = warMachineListData.map(wmId => {
                const storedWM = storedWarMachinesMap.get(wmId);
                if (storedWM) {
                    // Ensure existing war machines also have targetLevel
                    return { ...storedWM, targetLevel: storedWM.targetLevel || 0 };
                }
                return createDefaultWarMachine(wmId);
            });

            return allWarMachines;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const saveWarMachine = createAsyncThunk<WarMachine, WarMachine, { rejectValue: string }>(
    'warMachines/saveWarMachine',
    async (warMachineData, { rejectWithValue }) => {
        try {
            const savedWarMachine = await warMachineService.saveWarMachine(warMachineData);
            return savedWarMachine;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const warMachinesSlice = createSlice({
    name: 'warMachines',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWarMachines.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWarMachines.fulfilled, (state, action: PayloadAction<WarMachine[]>) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchWarMachines.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || 'An unknown error has occurred';
            })
            .addCase(saveWarMachine.fulfilled, (state, action: PayloadAction<WarMachine>) => {
                const savedWarMachine = action.payload;
                const existingIndex = state.list.findIndex(wm => wm.id === savedWarMachine.id);

                if (existingIndex !== -1) {
                    state.list[existingIndex] = savedWarMachine;
                } else {
                    state.list.push(savedWarMachine);
                }
            });
    },
});

export default warMachinesSlice.reducer;