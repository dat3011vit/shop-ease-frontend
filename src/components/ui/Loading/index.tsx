import { Icon } from "@iconify/react/dist/iconify.js";
import "./index.scss";
export const Loading = () => {
    return (
        <div className="loading">
            <div className="loading-container">
                {/* Animated circles background */}
                <div className="circle-container">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>

                {/* Logo with animations */}
                <div className="logo-wrapper">
                    <div className="logo-glow"></div>
                    {/* <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7dL8_8z0XQEaRgXui6ckHCY4Iod6Uuik7ug&s" 
                        alt="Orange Fashion Store"
                        className="logo-image"
                    /> */}
                </div>

                {/* Loading text with wave effect */}
                <div className="loading-text">
                    <span>L</span>
                    <span>o</span>
                    <span>a</span>
                    <span>d</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span>
                    <span className="dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </div>

                {/* Progress bar */}
                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>

                {/* Spinning ring */}
                <div className="spinner-ring"></div>
            </div>
        </div>
    );
};