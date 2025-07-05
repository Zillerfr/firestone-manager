import type { Hero } from "../types/crudInterfaces";

const HERO_STORAGE_KEY = 'firestone_manager.heroes'

class HeroService {

    /**
     * Sauvegarde un tableau de héros dans le localStorage.
     * Cette méthode est interne au service.
     * @param heroes Le tableau de héros à sauvegarder.
     */
    private async _savePlayers(heroes: Hero[]): Promise<void> {
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(heroes));
    }

    /**
     * Charge tous les héros depuis le localStorage.
     * @returns Une promesse résolue avec un tableau de Joueurs.
     */
    async getAllHeroes(): Promise<Hero[]> {
        const data = localStorage.getItem(HERO_STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return []; // Retourne un tableau vide si aucune donnée
    }

    /**
     * Récupère un héro par son ID.
     * @param id L'ID du héro.
     * @returns Une promesse résolue avec le héro trouvé, ou undefined.
     */
    async getHeroById(id: string): Promise<Hero | undefined> {
        const heroes = await this.getAllHeroes();
        return heroes.find((hero) => hero.id === id);
    }

    /**
     * Sauvegarde les informations d'un héro.
     * @param updatedHero Le héro à sauvegarder
     * @returns Une promesse résolue avec le Héro mis à jour.
     */
    async saveHero(updatedHero: Hero): Promise<Hero> {
        let heroes = await this.getAllHeroes();
        const index = heroes.findIndex((hero) => hero.id === updatedHero.id);

        if (index !== -1) {
            heroes[index] = { ...heroes[index], ...updatedHero };
            await this._savePlayers(heroes);
            return heroes[index];
        } else {
            heroes.push(updatedHero);
            await this._savePlayers(heroes);
            return updatedHero;
        }

    }
}

// Exportez une instance unique du service
export const heroService = new HeroService();