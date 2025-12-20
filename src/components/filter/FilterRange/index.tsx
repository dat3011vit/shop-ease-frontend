import { Icon } from '@iconify/react/dist/iconify.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import './index.scss';

// const Handle = Slider.Handle;
interface FilterRangeProps {
    title: string;
    min: string;
    max: string;
    step: number;
}

const FilterRange = ({ title, min, max, step }: FilterRangeProps) => {
    const [value, setValue] = useState<number[]>([parseInt(min), parseInt(max)]);
    const handleChange = (arrValue: number | number[]) => {
        const [start, end] = arrValue as number[];
        setValue([start, end]);
        console.log({ start: start, end: end });
    };
    return (
        <div className="filter-range">
            <h3>{title}</h3>
            <div className="filter-range__slider">
                <Slider
                    range
                    min={parseInt(min)}
                    max={parseInt(max)}
                    defaultValue={[parseInt(min), parseInt(max)]}
                    step={step}
                    onChange={handleChange}
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
