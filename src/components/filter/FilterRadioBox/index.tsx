import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { RadioBox } from '../../../components/ui';
import './index.scss';

interface FilterOptionRadioBoxProps {
    title: string;
    category: string;
    options: {
        value: string;
        label: string;
    }[];
}

const FilterOptionRadioBox: React.FC<FilterOptionRadioBoxProps> = ({ options, title, category }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentValue = searchParams.get(category) || '';

    const handleRadioChange = (value: string) => {
        if (value) {
            searchParams.set(category, value);
        } else {
            searchParams.delete(category);
        }
        // Reset to page 1 when filter changes
        searchParams.set('page', '1');
        setSearchParams(searchParams);
    };

    return (
        <div className="filter-radio-box">
            <h3>{title}</h3>
            {options.map((item, index) => (
                <div key={index} className="filter-radio-box__field">
                    <input
                        type="radio"
                        name={category}
                        value={item.value}
                        id={`${category}-${item.value}`}
                        checked={currentValue === item.value}
                        onChange={() => handleRadioChange(item.value)}
                    />
                    <label htmlFor={`${category}-${item.value}`}>{item.label}</label>
                </div>
            ))}
        </div>
    );
};

export default FilterOptionRadioBox;
