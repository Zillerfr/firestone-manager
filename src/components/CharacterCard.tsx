import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Character } from '../types/dataInterfaces';
import HeroDetailsModal from './HeroDetailsModal';
import { fetchHeroById, clearSelectedHero } from '../store/heroesSlice'; // Importez vos actions Redux
import type { AppDispatch } from '../store';

interface CharacterCardProps {
    character: Character;
    isLocked: boolean;
}

const images = import.meta.glob('../assets/characters/*.webp', { eager: true, as: 'url' });

const getCharacterImage = (id: string): string => {
    const imagePath = `../assets/characters/${id}.webp`;
    if (images[imagePath]) {
        return images[imagePath] as string;
    }
    console.warn(`Image for character ${id}.webp not found at path: ${imagePath}`);
    return '/path/to/default-image.webp'; // REMPLACEZ ceci
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isLocked }) => {
    const dispatch: AppDispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const imageUrl = getCharacterImage(character.id);
    const displayedId = capitalizeFirstLetter(character.id);

    const handleCardClick = () => {
        // Dispatch l'action pour charger les détails du héros dans le store
        dispatch(fetchHeroById(character.id));
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Nettoyer le selectedHero dans le store quand la modale est fermée
        dispatch(clearSelectedHero());
    };

    return (
        <>
            <div className={`character-card ${isLocked ? 'locked' : ''}`} onClick={handleCardClick}>
                <img src={imageUrl} alt={character.id} className="character-image" />
                <p className="character-id">{displayedId}</p>
            </div>

            {/* Affiche la modale si isModalOpen est vrai */}
            {isModalOpen && (
                <HeroDetailsModal
                    heroCharacterId={character.id} // Peut encore être utile pour des vérifications
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default CharacterCard;