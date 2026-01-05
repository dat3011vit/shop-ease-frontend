import { Icon } from '@iconify/react/dist/iconify.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './index.scss';

interface FilterRangeProps {
    title: string;
    min: string;
    max: string;
    step: number;
}

const FilterRange = ({ title, min, max, step }: FilterRangeProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get initial values from URL or use defaults
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const [value, setValue] = useState<number[]>([
        minPrice ? parseInt(minPrice) : parseInt(min),
        maxPrice ? parseInt(maxPrice) : parseInt(max)
    ]);

    const handleChange = (arrValue: number | number[]) => {
        const [start, end] = arrValue as number[];
        setValue([start, end]);
    };

    // Update URL params when slider is released
    const handleAfterChange = (arrValue: number | number[]) => {
        const [start, end] = arrValue as number[];
        searchParams.set('minPrice', start.toString());
        searchParams.set('maxPrice', end.toString());
        searchParams.set('page', '1');
        setSearchParams(searchParams);
    };
    return (
        <div className="filter-range">
            <h3>{title}</h3>
            <div className="filter-range__slider">
                <Slider
                    range
                    min={parseInt(min)}
                    max={parseInt(max)}
                    value={value}
                    step={step}
                    onChange={handleChange}
                    onAfterChange={handleAfterChange}
                />
                <div className="filter-range__info">
                    <div className="filter-range__item">
                        <label htmlFor="minPrice">Min price</label>
                        <div className="filter-range__value">
                            <Icon icon="hugeicons:money-bag-02" />
                            <input disabled id="minPrice" name="minPrice" value={value[0]} />
                        </div>
                    </div>
                    <div className="filter-range__item">
                        <label htmlFor="maxPrice">Max price</label>
                        <div className="filter-range__value">
                            <input disabled id="maxPrice" name="maxPrice" value={value[1]} />
                            <Icon icon="hugeicons:money-bag-02" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterRange;
