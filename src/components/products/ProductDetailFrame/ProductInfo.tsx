import { Link } from "react-router-dom";
// import { COLORS, SIZES } from "../../../utils/enum";
import { Badge } from "../../ui";
import { Icon } from "@iconify/react";
// import { formatMoney } from "../../../utils/util";
// import { Product } from "../../../types/product-type";
import { memo } from "react";
import {IProduct} from "../../../common/models/Product.ts";

interface ProductInfoProps {
    product?: IProduct;
    options: {
        color: (typeof COLORS)[number];
        size: (typeof SIZES)[number];
    };
    onColorChange: (color: (typeof COLORS)[number]) => void;
    onSizeChange: (size: (typeof SIZES)[number]) => void;
}

const ProductInfoComponent = ({
    product,
    options,
    onColorChange,
    onSizeChange,
}: ProductInfoProps) => (
    <>
        <h2>{product?.name}</h2>
        <div className="product-detail-frame__details">
            <div className="price">{1
                // formatMoney(product?.price || 0)
            }</div>
            <div className="border">|</div>
            <Link className="star" to="">
                <Icon icon="solar:star-bold" />
                <span>4.9</span>
                <span>.</span>
                <span>142 reviews</span>
            </Link>
            <span>.</span>
            <Badge name="New in" />
        </div>
        <div className="product-detail-frame__colors">
            <label>
                Color: <b>{options.color.label}</b>
            </label>
            <div className="color-list">
                {COLORS.map((color) => (
                    <div
                        key={color.value}
                        className={`color-option ${
                            options.color.value === color.value
                                ? "selected"
                                : ""
                        }`}
                        onClick={() => onColorChange(color)}
                    >
                        <div className={`color-swatch ${color.value}-bg`} />
                    </div>
                ))}
            </div>
        </div>
        <div className="product-detail-frame__sizes">
            <label>
                Size: <b>{options.size.label}</b>
            </label>
            <div className="size-list">
                {SIZES.map((size) => (
                    <div
                        key={size.value}
                        className={`size-option ${
                            options.size.value === size.value ? "selected" : ""
                        }`}
                        onClick={() => onSizeChange(size)}
                    >
                        {size.label}
                    </div>
                ))}
            </div>
        </div>
    </>
);

export const ProductInfo = memo(ProductInfoComponent);
export const COLORS = [
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
] as const;
export const SIZES = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "2XL", label: "2XL" },
    { value: "3XL", label: "3XL" },
] as const;