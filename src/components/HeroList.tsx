import React, { useEffect, useState } from 'react';
import CharacterSection from '../components/CharacterSection';
import type { Character } from '../types/dataInterfaces';
import charactersData from '../data/characters.json'; // Importez directement le JSON
import { useTranslation } from 'react-i18next';

const CharactersPage: React.FC = () => {
    const [heroes, setHeroes] = useState<Character[]>([]);
    const [mercenaries, setMercenaries] = useState<Character[]>([]);
    const [gods, setGods] = useState<Character[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        // Le fichier JSON est importé directement, donc pas besoin d'un fetch asynchrone complexe
        const allCharacters: Character[] = charactersData as Character[];

        const filteredHeroes = allCharacters.filter(c => !c.merc && !c.god);
        const filteredMercenaries = allCharacters.filter(c => c.merc);
        const filteredGods = allCharacters.filter(c => c.god);

        setHeroes(filteredHeroes);
        setMercenaries(filteredMercenaries);
        setGods(filteredGods);
    }, []); // Le tableau de dépendances vide signifie que cela s'exécute une seule fois au montage

    return (
        <div className="characters-page">
            <CharacterSection title={t('characters.title_heroes')} characters={heroes} />
            <div className="characters-group">
                <CharacterSection title={t('characters.title_mercenaries')} characters={mercenaries} />
                <CharacterSection title={t('characters.title_gods')} characters={gods} />
            </div>
        </div>
    );
};

export default CharactersPage;