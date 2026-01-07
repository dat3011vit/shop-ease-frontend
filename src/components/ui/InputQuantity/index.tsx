import { HTMLAttributes, memo, useState, useEffect } from "react";
import "./index.scss";

interface InputQuantityProps extends HTMLAttributes<HTMLInputElement> {
    quantity: number;
    onChangeQuantity: (value: number) => void;
    max?: number;
    fullWidth?: boolean;
}

const InputQuantityComponent: React.FC<InputQuantityProps> = ({
    quantity,
    className = "",
    onChangeQuantity,
    max,
    fullWidth,
    ...rest
}) => {
    // Local state để lưu giá trị đang nhập (cho phép rỗng tạm thời)
    const [inputValue, setInputValue] = useState<string>(String(quantity));

    // Sync với prop quantity khi nó thay đổi từ bên ngoài
    useEffect(() => {
        setInputValue(String(quantity));
    }, [quantity]);

    const updateQuantityByIcon = (value: number) => {
        const newQuantity = Math.max(quantity + value, 1);

        if (max && newQuantity > max) {
            return;
        }
        if (newQuantity <= 0) {
            onChangeQuantity(1);
            setInputValue("1");
            return;
        }
        onChangeQuantity(newQuantity);
        setInputValue(String(newQuantity));
    };

    const entryQuantity = (value: string) => {
        // Cho phép rỗng tạm thời khi user đang xóa để nhập số mới
        if (value === "") {
            setInputValue("");
            return;
        }

        const newValue = Number(value);

        // Validate: phải là số hợp lệ
        if (isNaN(newValue)) {
            return;
        }

        // Validate: không vượt quá max
        if (max && newValue > max) {
            setInputValue(String(max));
            onChangeQuantity(max);
            return;
        }

        // Validate: phải > 0
        if (newValue < 1) {
            setInputValue(value); // Vẫn cho hiển thị giá trị user đang gõ
            return;
        }

        // Giá trị hợp lệ
        setInputValue(value);
        onChangeQuantity(newValue);
    };

    const handleBlur = (value: string) => {
        // Khi blur: nếu rỗng hoặc không hợp lệ → reset về 1
        if (value === "" || value === "0" || Number(value) < 1 || isNaN(Number(value))) {
            onChangeQuantity(1);
            setInputValue("1");
        }
    };

    if (fullWidth) className += " full-width";
    return (
        <div className={`quantity ${className}`} {...rest}>
            <span
                className="quantity__btn right"
                onClick={() => updateQuantityByIcon(1)}
            >
                +
            </span>
            <input
                onKeyDown={(event) => {
                    if (
                        !/[0-9]/.test(event.key) &&
                        event.key !== "Delete" &&
                        event.key !== "Backspace" &&
                        event.key !== "ArrowRight" &&
                        event.key !== "ArrowLeft"
                    ) {
                        event.preventDefault();
                    }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    handleBlur(e.currentTarget.value.trim())
                }
                type="tel"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    entryQuantity(e.target.value.trim())
                }
                pattern="[0-9]*"
                className="quantity__textfield"
                value={inputValue}
                min="1"
                max={max}
            />
            <span
                className="quantity__btn left"
                onClick={() => updateQuantityByIcon(-1)}
            >
                -
            </span>
        </div>
    );
};

export const InputQuantity = memo(InputQuantityComponent);
