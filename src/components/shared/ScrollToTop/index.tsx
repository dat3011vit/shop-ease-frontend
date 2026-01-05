import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './index.scss';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`scroll-to-top ${isVisible ? 'scroll-to-top--visible' : ''}`}>
            <button
                onClick={scrollToTop}
                className="scroll-to-top__button"
                aria-label="Scroll to top"
            >
                <Icon icon="solar:alt-arrow-up-bold" className="scroll-to-top__icon" />
            </button>
        </div>
    );
};

export default ScrollToTop;
