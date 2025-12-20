import React from 'react';
import { CheckBox } from '../../../components/ui/Checkbox';
import './index.scss';

type FilterCategory = 'color' | 'size';

interface FilterOptionCheckboxProps {
    title: string;
    category: FilterCategory;
    options: { value: string; label: string }[];
    // filter: Record<string, string[]> | undefined;
}

const FilterOptionCheckbox: React.FC<FilterOptionCheckboxProps> = ({
    category,
    options,
    // filter,
    title,
}) => {
    const handleCheckboxChange = (itemValue: string) => {};

    return (
        <div className="filter-checkbox">
            <h3>{title}</h3>
            {options.map((item, index) => (
                <div key={item.value} className="filter-checkbox__field">
                    <CheckBox
                        id={`${title}-${index}`}
                        onChange={() => handleCheckboxChange(item.value)}
                        // checked={filter?.[category]?.includes(item.value) || false}
                    />
                    <label htmlFor={`${title}-${index}`}>{item.label}</label>
                </div>
            ))}
        </div>
    );
};

export default FilterOptionCheckbox;
