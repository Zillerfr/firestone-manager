import type { WarMachine } from "../types/crudInterfaces";

const WAR_MACHINE_STORAGE_KEY = 'firestone_manager.warmachines';

class WarMachineService {

    /**
     * Saves an array of war machines to localStorage.
     * This method is internal to the service.
     * @param warMachines The array of war machines to save.
     */
    private async _saveWarMachines(warMachines: WarMachine[]): Promise<void> {
        localStorage.setItem(WAR_MACHINE_STORAGE_KEY, JSON.stringify(warMachines));
    }

    /**
     * Loads all war machines from localStorage.
     * @returns A promise resolved with an array of WarMachines.
     */
    async getAllWarMachines(): Promise<WarMachine[]> {
        const data = localStorage.getItem(WAR_MACHINE_STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return []; // Return an empty array if no data
    }

    /**
     * Retrieves a war machine by its ID.
     * @param id The ID of the war machine.
     * @returns A promise resolved with the found war machine, or undefined.
     */
    async getWarMachineById(id: string): Promise<WarMachine | undefined> {
        const warMachines = await this.getAllWarMachines();
        return warMachines.find((wm) => wm.id === id);
    }

    /**
     * Saves the information of a war machine.
     * @param updatedWarMachine The war machine to save.
     * @returns A promise resolved with the updated WarMachine.
     */
    async saveWarMachine(updatedWarMachine: WarMachine): Promise<WarMachine> {
        const warMachines = await this.getAllWarMachines();
        const index = warMachines.findIndex((wm) => wm.id === updatedWarMachine.id);

        if (index !== -1) {
            warMachines[index] = { ...warMachines[index], ...updatedWarMachine };
            await this._saveWarMachines(warMachines);
            return warMachines[index];
        } else {
            warMachines.push(updatedWarMachine);
            await this._saveWarMachines(warMachines);
            return updatedWarMachine;
        }
    }
}

// Export a unique instance of the service
export const warMachineService = new WarMachineService();
