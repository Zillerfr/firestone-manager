import React from 'react';
import { useSelector } from 'react-redux'; // Importez useSelector
import type { Character } from '../types/dataInterfaces';
import type { Hero } from '../types/crudInterfaces'; // Importez l'interface Hero
import CharacterCard from './CharacterCard';
import { useTranslation } from 'react-i18next'; // Ajout de l'import pour useTranslation
import './CharacterSection.css';

interface CharacterSectionProps {
    title: string;
    characters: Character[];
}

const CharacterSection: React.FC<CharacterSectionProps> = ({ title, characters }) => {
    const { t } = useTranslation();
    // Sélectionnez la liste des héros depuis le store Redux
    const heroes = useSelector((state: any) => state.heroes.list as Hero[]); // Assurez-vous que 'state.heroes.list' est le chemin correct vers votre liste de héros

    if (!characters || characters.length === 0) {
        return (
            <section className="character-section">
                <h2>{title}</h2>
                <p>{t('characters.no_character')}</p>
            </section>
        );
    }

    return (
        <section className="character-section">
            <h2>{title}</h2>
            <div className="character-grid">
                {characters.map((character) => {
                    // Vérifiez si ce personnage existe dans la liste des héros débloqués
                    const heroData = heroes.find(hero => hero.id === character.id);
                    // Le personnage est considéré "bloqué" si :
                    // 1. Il n'existe pas dans la liste des héros sauvegardés (heroData est undefined)
                    // 2. Il existe, mais sa propriété `unlocked` est à `false`
                    const isLocked = !heroData || !heroData.unlocked;

                    return (
                        <CharacterCard
                            key={character.id}
                            character={character}
                            isLocked={isLocked} // Passez la prop isLocked au CharacterCard
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default CharacterSection;