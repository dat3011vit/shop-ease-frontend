import React from 'react';
import { RadioBox } from '../../../components/ui';
import './index.scss';

interface FilterOptionRadioBoxProps {
    title: string;
    options: {
        value: string;
        label: string;
    }[];
}

const FilterOptionRadioBox: React.FC<FilterOptionRadioBoxProps> = ({ options, title }) => {
    return (
        <div className="filter-radio-box">
            <h3>{title}</h3>
            {options.map((item, index) => (
                <div key={index} className="filter-radio-box__field">
                    <RadioBox
                        name={item.label}
                        value={item.value}
                        id={`${item.label}-${item.value}`}
                        label={item.label}
                    />
                </div>
            ))}
        </div>
    );
};

export default FilterOptionRadioBox;
