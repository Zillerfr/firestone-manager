import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { Hero, HeroItem } from '../types/crudInterfaces';
import {
    saveHero,
} from '../store/heroesSlice';
import type { RootState, AppDispatch } from '../store';
import warMachineList from '../data/warmachineList.json'; // Importez les données d'items
import itemTypes from '../data/itemTypes.json'; // Importez les données d'items
import gears from '../data/gears.json'; // Importez les données d'items
import jewels from '../data/jewels.json'; // Importez les données d'items
import soulstones from '../data/soulstones.json'; // Importez les données d'items
import WarMachineSelector from './WarMachineSelector';
import ItemSection from './ItemSection'; // Importez le nouveau composant
import './HeroDetailsModal.css';

const characterImages = import.meta.glob('../assets/characters/*.webp', { eager: true, as: 'url' });
const getCharacterImage = (id: string): string => {
    const imagePath = `../assets/characters/${id}.webp`;
    if (characterImages[imagePath]) {
        return characterImages[imagePath] as string;
    }
    return '/path/to/default-image.webp';
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

interface HeroDetailsModalProps {
    heroCharacterId: string;
    onClose: () => void;
}

const HeroDetailsModal: React.FC<HeroDetailsModalProps> = ({ heroCharacterId, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    const { selectedHero, status, error } = useSelector((state: RootState) => state.heroes);

    const [editedHero, setEditedHero] = useState<Hero | null>(null);
    // State to keep track of which ItemCard's dropdown is open
    const [openDropdownItemId, setOpenDropdownItemId] = useState<string | null>(null);


    useEffect(() => {
        if (selectedHero && selectedHero.id === heroCharacterId) {
            setEditedHero({ ...selectedHero });
        } else {
            setEditedHero(null);
        }
    }, [selectedHero, heroCharacterId]);

    const handleSave = async () => {
        if (editedHero) {
            const resultAction = await dispatch(saveHero(editedHero));
            if (saveHero.fulfilled.match(resultAction)) {
                onClose();
            } else {
                console.error("Failed to save hero:", resultAction.payload);
            }
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | boolean;
        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        } else {
            newValue = value;
        }

        if (editedHero) {
            setEditedHero(prev => ({
                ...prev!,
                [name]: newValue
            }));
        }
    };

    const handleWarMachineChange = (selectedWarMachineId: string) => {
        if (editedHero) {
            setEditedHero(prev => ({
                ...prev!,
                warMachine: selectedWarMachineId
            }));
        }
    };

    // Nouvelle fonction pour gérer la mise à jour d'un HeroItem spécifique
    const handleItemChange = (itemType: 'gear' | 'jewel' | 'soulstone', updatedItem: HeroItem) => {
        if (editedHero) {
            setEditedHero(prev => {
                if (!prev) return null; // Précaution si prev est null

                // Crée une NOUVELLE copie de l'array d'items
                const newItemsArray = prev[itemType].map(item => {
                    // Si c'est l'item que nous voulons mettre à jour, retournez une NOUVELLE COPIE de cet item
                    return item.id === updatedItem.id ? { ...updatedItem } : item;
                });

                return {
                    ...prev,
                    [itemType]: newItemsArray, // Assurez-vous que c'est le nouvel array
                };
            });
        }
    };


    if (status === 'loading' && (!editedHero || editedHero.id !== heroCharacterId)) {
        return ReactDOM.createPortal(
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>Chargement des détails du héros...</p>
                </div>
            </div>,
            document.body
        );
    }

    if (status === 'failed' && !editedHero) {
        return ReactDOM.createPortal(
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>Erreur lors du chargement des détails du héros: {error}</p>
                    <button onClick={onClose}>Fermer</button>
                </div>
            </div>,
            document.body
        );
    }

    if (!editedHero) {
        return null;
    }

    // Récupérer le type d'item "gear", "jewel", "soulstone" à partir de itemTypes.json
    const gearType = itemTypes.find(type => type.id === 'gear');
    const jewelType = itemTypes.find(type => type.id === 'jewel');
    const soulstoneType = itemTypes.find(type => type.id === 'soulstone');

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="modal-header-content">
                        <div className="modal-header-img">
                            <img
                                src={getCharacterImage(editedHero.id)}
                                alt={editedHero.id}
                                className="modal-hero-image"
                            />
                            <h2>{capitalizeFirstLetter(editedHero.id)}</h2>
                        </div>
                        <div className="top-controls">
                            <div className="form-group">
                                <label htmlFor="unlocked-checkbox">Déverrouillé:</label>
                                <input
                                    id="unlocked-checkbox"
                                    type="checkbox"
                                    name="unlocked"
                                    checked={editedHero.unlocked}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Machine de Guerre:</label>
                                <WarMachineSelector
                                    currentWarMachineId={editedHero.warMachine}
                                    warMachineOptions={warMachineList}
                                    onChange={handleWarMachineChange}
                                />
                            </div>
                        </div>
                    </div>
                    <button className="close-button" onClick={handleCancel}>&times;</button>
                </div>

                <div className="modal-body">
                    {gearType && (
                        <ItemSection
                            title="Équipement"
                            itemType="gear"
                            heroItems={editedHero.gear}
                            allItems={gears}
                            itemTypeInfo={gearType}
                            onItemChange={handleItemChange}
                            openDropdownItemId={openDropdownItemId} // Pass centralized state
                            setOpenDropdownItemId={setOpenDropdownItemId} // Pass setter
                        />
                    )}
                    {jewelType && (
                        <ItemSection
                            title="Bijoux"
                            itemType="jewel"
                            heroItems={editedHero.jewel}
                            allItems={jewels}
                            itemTypeInfo={jewelType}
                            onItemChange={handleItemChange}
                            openDropdownItemId={openDropdownItemId} // Pass centralized state
                            setOpenDropdownItemId={setOpenDropdownItemId} // Pass setter
                        />
                    )}
                    {soulstoneType && (
                        <ItemSection
                            title="Pierres d'âme"
                            itemType="soulstone"
                            heroItems={editedHero.soulstone}
                            allItems={soulstones}
                            itemTypeInfo={soulstoneType}
                            onItemChange={handleItemChange}
                            openDropdownItemId={openDropdownItemId} // Pass centralized state
                            setOpenDropdownItemId={setOpenDropdownItemId} // Pass setter
                        />
                    )}
                </div>

                <div className="modal-footer">
                    <button onClick={handleSave} className="save-button">Enregistrer</button>
                    <button onClick={handleCancel} className="cancel-button">Annuler</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default HeroDetailsModal;