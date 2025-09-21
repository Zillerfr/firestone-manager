import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import WarMachineTableSection from './WarMachineTableSection';
import { fetchWarMachines } from '../store/warmachinesSlice';
import type { RootState, AppDispatch } from '../store';
import type { WarMachine } from '../types/crudInterfaces';

export type SortKey = 'default' | 'id';
type SortOrder = 'asc' | 'desc';

const WarMachineTableList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { list: warMachinesFromStore, status } = useSelector((state: RootState) => state.warMachines);
    const [allWarMachines, setAllWarMachines] = useState<WarMachine[]>([]);
    const [sortBy, setSortBy] = useState<SortKey>('default');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const { t } = useTranslation();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchWarMachines());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setAllWarMachines(warMachinesFromStore);
    }, [warMachinesFromStore]);

    const sortedWarMachines = useMemo(() => {
        if (sortBy === 'default') {
            return [...allWarMachines];
        }

        const sorted = [...allWarMachines].sort((a, b) => {
            const valA: string = a.id;
            const valB: string = b.id;

            return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
        return sorted;
    }, [allWarMachines, sortBy, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (sortBy === key) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            }
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="warmachines-page">
            <WarMachineTableSection
                title={t('warmachines.title')}
                warMachines={sortedWarMachines}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />
        </div>
    );
};

export default WarMachineTableList;