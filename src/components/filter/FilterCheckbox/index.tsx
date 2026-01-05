import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckBox } from '../../../components/ui/Checkbox';
import './index.scss';

type FilterCategory = 'color' | 'size';

interface FilterOptionCheckboxProps {
    title: string;
    category: FilterCategory;
    options: { value: string; label: string }[];
}

const FilterOptionCheckbox: React.FC<FilterOptionCheckboxProps> = ({
    category,
    options,
    title,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get current selected values from URL
    const currentValues = searchParams.get(category)?.split(',').filter(Boolean) || [];

    const handleCheckboxChange = (itemValue: string) => {
        let newValues: string[];

        if (currentValues.includes(itemValue)) {
            // Remove value if already selected
            newValues = currentValues.filter(v => v !== itemValue);
        } else {
            // Add value if not selected
            newValues = [...currentValues, itemValue];
        }

        console.log(`[FilterCheckbox] ${category} changed:`, newValues);

        // Update search params
        if (newValues.length > 0) {
            searchParams.set(category, newValues.join(','));
        } else {
            searchParams.delete(category);
        }

        // Reset to page 1 when filter changes
        searchParams.set('page', '1');
        setSearchParams(searchParams);

        console.log('[FilterCheckbox] Updated URL:', window.location.search);
    };

    return (
        <div className="filter-checkbox">
            <h3>{title}</h3>
            {options.map((item, index) => (
                <div key={item.value} className="filter-checkbox__field">
                    <CheckBox
                        id={`${title}-${index}`}
                        onChange={() => handleCheckboxChange(item.value)}
                        checked={currentValues.includes(item.value)}
                    />
                    <label htmlFor={`${title}-${index}`}>{item.label}</label>
                </div>
            ))}
        </div>
    );
};

export default FilterOptionCheckbox;
