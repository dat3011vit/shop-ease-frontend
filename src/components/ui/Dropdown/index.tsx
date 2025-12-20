import { memo } from "react";
import { DropdownItem } from "./DropdownItem";
import "./index.scss";

interface DropdownItemData {
    label: string;
    url: string;
}

interface DropdownProps {
    data: DropdownItemData[];
    generateUrl: (itemId: string) => string; // Callback function to generate URL
}

const DropdownComponent = ({
    data,
    generateUrl,
}: DropdownProps) => {
    return (
        <div className="dropdown">
            {data.map((item, index) => (
                <DropdownItem
                    generateUrl={generateUrl}
                    key={index}
                    label={item.label}
                    url={item.url}
                />
            ))}
        </div>
    );
};

export const Dropdown = memo(DropdownComponent);
