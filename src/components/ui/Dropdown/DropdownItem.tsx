import { memo } from "react";
import { useNavigate } from "react-router-dom";

interface DropdownItemProps {
    label: string;
    url: string;
    generateUrl: (itemId: string) => string;
}

const DropdownItemComponent = ({ label, url, generateUrl }: DropdownItemProps) => {
    const navigate = useNavigate();

    const handleItemClick = () => {
        const newUrl = generateUrl(url); // Giả sử url đã được sử dụng như ID
        navigate(newUrl, { replace: true });
    };

    return (
        <div className="dropdown__item" onClick={handleItemClick}>
            <div className="dropdown__item--name">{label}</div>
        </div>
    );
};

export const DropdownItem = memo(DropdownItemComponent);
