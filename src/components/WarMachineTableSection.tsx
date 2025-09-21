import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SortKey } from './WarMachineTableList';
import WarMachineTableRow from './WarMachineTableRow';
import type { WarMachine } from '../types/crudInterfaces';

interface WarMachineTableSectionProps {
    title: string;
    warMachines: WarMachine[];
    sortBy: SortKey;
    sortOrder: 'asc' | 'desc';
    onSort: (key: SortKey) => void;
}

const WarMachineTableSection: React.FC<WarMachineTableSectionProps> = ({ title, warMachines, sortBy, sortOrder, onSort }) => {
    const { t } = useTranslation();

    const getArrow = (key: SortKey) => {
        if (sortBy === key) {
            return sortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    return (
        <section className="character-section">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th colSpan={4} className="centered-header table-col-separator">{t('warmachines.data_columns_header')}</th>
                        <th colSpan={2} className="centered-header table-col-separator">{t('warmachines.experience_columns_header')}</th>
                        <th colSpan={6} className="centered-header">{t('warmachines.needed_columns_header')}</th>
                    </tr>
                    <tr>
                        <th onClick={() => onSort('id')} className="centered-header table-col-separator">
                            {t('warmachines.war_machine')}{getArrow('id')}
                        </th>
                        <th className="centered-header table-col-separator">{t('warmachines.level')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.experience')}</th>
                        <th className="table-col-separator centered-header">{t('warmachines.target_level')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.total_experience')}</th>
                        <th className="table-col-separator centered-header">{t('warmachines.target_experience')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.experience_needed_short')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.upgrades_needed_short')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.tokens_needed_short')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.screws_needed_short')}</th>
                        <th className="centered-header table-col-separator">{t('warmachines.cogs_needed_short')}</th>
                        <th className="centered-header">{t('warmachines.metal_needed_short')}</th>
                    </tr>
                </thead>
                <tbody>
                    {warMachines.map(warMachine => (
                        <WarMachineTableRow
                            key={warMachine.id}
                            warMachine={warMachine}
                        />
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default WarMachineTableSection;