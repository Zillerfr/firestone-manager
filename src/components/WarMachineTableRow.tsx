import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import './WarMachineTableRow.css';
import type { WarMachine } from '../types/crudInterfaces';
import type { AppDispatch } from '../store';
import { saveWarMachine } from '../store/warmachinesSlice';
import {
    calculateExperienceForLevel,
    calculateTotalExperience,
    calculateExperienceNeeded,
    calculateUpgradesNeeded,
    calculateTokensNeeded,
    calculateScrewsNeeded,
    calculateCogsNeeded,
    calculateMetalNeeded
} from '../utils/warmachineCalculations';

const warMachineImages = import.meta.glob('../assets/machines/*.webp', { eager: true, as: 'url' });
const getWarMachineImage = (id: string): string => {
    const imagePath = `../assets/machines/${id}.webp`;
    if (warMachineImages[imagePath]) {
        return warMachineImages[imagePath] as string;
    }
    return '';
};

interface WarMachineTableRowProps {
    warMachine: WarMachine;
}

const WarMachineTableRow: React.FC<WarMachineTableRowProps> = ({ warMachine }) => {
    const { t, i18n } = useTranslation(); // Destructure i18n from useTranslation
    const dispatch: AppDispatch = useDispatch();
    const displayedWarMachineName = t(`warmachines.${warMachine.id}`);

    const [level, setLevel] = useState(warMachine.level);
    const [experience, setExperience] = useState(warMachine.experience);
    const [targetLevel, setTargetLevel] = useState(warMachine.targetLevel);

    // Debounce mechanism
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setLevel(warMachine.level);
        setExperience(warMachine.experience);
        setTargetLevel(warMachine.targetLevel);
    }, [warMachine]);

    const handleSave = (updatedWarMachine: WarMachine) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            dispatch(saveWarMachine(updatedWarMachine));
        }, 500);
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLevel = parseInt(e.target.value, 10);
        setLevel(newLevel);
        handleSave({ ...warMachine, level: newLevel });
    };

    const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newExperience = parseInt(e.target.value, 10);
        setExperience(newExperience);
        handleSave({ ...warMachine, experience: newExperience });
    };

    const handleTargetLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTargetLevel = parseInt(e.target.value, 10);
        setTargetLevel(newTargetLevel);
        handleSave({ ...warMachine, targetLevel: newTargetLevel });
    };

    const handleLevelIncrement = () => {
        const newLevel = level + 1;
        setLevel(newLevel);
        handleSave({ ...warMachine, level: newLevel });
    };

    const handleLevelDecrement = () => {
        const newLevel = Math.max(0, level - 1);
        setLevel(newLevel);
        handleSave({ ...warMachine, level: newLevel });
    };

    const handleExperienceIncrement = () => {
        const newExperience = experience + 10; // Increment by 10
        setExperience(newExperience);
        handleSave({ ...warMachine, experience: newExperience });
    };

    const handleExperienceDecrement = () => {
        const newExperience = Math.max(0, experience - 10); // Decrement by 10
        setExperience(newExperience);
        handleSave({ ...warMachine, experience: newExperience });
    };

    const handleTargetLevelIncrement = () => {
        const newTargetLevel = targetLevel + 1;
        setTargetLevel(newTargetLevel);
        handleSave({ ...warMachine, targetLevel: newTargetLevel });
    };

    const handleTargetLevelDecrement = () => {
        const newTargetLevel = Math.max(0, targetLevel - 1);
        setTargetLevel(newTargetLevel);
        handleSave({ ...warMachine, targetLevel: newTargetLevel });
    };

    const totalExperience = useMemo(() => calculateTotalExperience(level, experience), [level, experience]);
    const targetExperience = useMemo(() => calculateExperienceForLevel(targetLevel), [targetLevel]);
    const experienceNeeded = useMemo(() => calculateExperienceNeeded(totalExperience, targetExperience), [totalExperience, targetExperience]);
    const upgradesNeeded = useMemo(() => calculateUpgradesNeeded(experienceNeeded), [experienceNeeded]);
    const tokensNeeded = useMemo(() => calculateTokensNeeded(upgradesNeeded), [upgradesNeeded]);
    const screwsNeeded = useMemo(() => calculateScrewsNeeded(upgradesNeeded), [upgradesNeeded]);
    const cogsNeeded = useMemo(() => calculateCogsNeeded(upgradesNeeded), [upgradesNeeded]);
    const metalNeeded = useMemo(() => calculateMetalNeeded(upgradesNeeded), [upgradesNeeded]);

    // Number formatter based on current language
    const numberFormatter = useMemo(() => {
        return new Intl.NumberFormat(i18n.language);
    }, [i18n.language]);

    return (
        <tr>
            <td className="centered-cell table-col-separator"> {/* Add separator */}
                <div className="war-machine-name-cell">
                    <img src={getWarMachineImage(warMachine.id)} alt={displayedWarMachineName} className="war-machine-image" />
                    <span>{displayedWarMachineName}</span>
                </div>
            </td>
            <td className="centered-cell table-col-separator"> {/* Add separator */}
                <div className="number-input-container">
                    <button onClick={handleLevelDecrement} className="number-input-button">-</button>
                    <input
                        type="number"
                        value={level}
                        onChange={handleLevelChange}
                        min="0"
                        className="war-machine-input"
                    />
                    <button onClick={handleLevelIncrement} className="number-input-button">+</button>
                </div>
            </td>
            <td className="centered-cell table-col-separator"> {/* Add separator */}
                <div className="number-input-container">
                    <button onClick={handleExperienceDecrement} className="number-input-button">-</button>
                    <input
                        type="number"
                        value={experience}
                        onChange={handleExperienceChange}
                        min="0"
                        className="war-machine-input"
                    />
                    <button onClick={handleExperienceIncrement} className="number-input-button">+</button>
                </div>
            </td>
            <td className="table-col-separator centered-cell"> {/* Add separator */}
                <div className="number-input-container">
                    <button onClick={handleTargetLevelDecrement} className="number-input-button">-</button>
                    <input
                        type="number"
                        value={targetLevel}
                        onChange={handleTargetLevelChange}
                        min="0"
                        className="war-machine-input"
                    />
                    <button onClick={handleTargetLevelIncrement} className="number-input-button">+</button>
                </div>
            </td>
            <td className="centered-cell table-col-separator">{numberFormatter.format(totalExperience)}</td> {/* Add separator */}
            <td className="table-col-separator centered-cell">{numberFormatter.format(targetExperience)}</td> {/* Add separator */}
            <td className="centered-cell table-col-separator">{numberFormatter.format(experienceNeeded)}</td> {/* Add separator */}
            <td className="centered-cell table-col-separator">{numberFormatter.format(upgradesNeeded)}</td> {/* Add separator */}
            <td className="centered-cell table-col-separator">{numberFormatter.format(tokensNeeded)}</td> {/* Add separator */}
            <td className="centered-cell table-col-separator">{numberFormatter.format(screwsNeeded)}</td> {/* Add separator */}
            <td className="centered-cell table-col-separator">{numberFormatter.format(cogsNeeded)}</td> {/* Add separator */}
            <td className="centered-cell">{numberFormatter.format(metalNeeded)}</td>
        </tr>
    );
};

export default React.memo(WarMachineTableRow);