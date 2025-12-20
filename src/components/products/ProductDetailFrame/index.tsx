import { useLocation, useParams } from "react-router-dom";
import "./index.scss";
// import { useProduct } from "../../../hooks/useProduct";
import { Accordion, Loading } from "../../ui";
import { memo, useEffect, useState, useCallback } from "react";
// import { COLORS, SIZES } from "../../../utils/enum";
// import { useCart } from "../../../hooks/useCart";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "../../../store";
// import { Product } from "../../../types/product-type";
import ProductDetails from "./ProductDetails";
// import { DataProductDetailInfo } from "../../../utils/fakeData";
// import { addToCart } from "../../../store/cart-slice";
import { ProductInfo } from "./ProductInfo";
import { ProductImage } from "./ProductImage";
import { ProductActions } from "./ProductActions";
import {IProduct} from "../../../common/models/Product.ts";
import {DataProductDetailInfo} from "../../../utils/datafake.ts";

interface ProductDetailFrameProps {
    isPage?: boolean;
    productModal?: IProduct;
}

const ProductDetailFrameComponent = ({
    isPage = false,
    productModal,
}: ProductDetailFrameProps) => {
    const [options, setOptions] = useState<{
        color: (typeof COLORS)[number];
        size: (typeof SIZES)[number];
    }>({
        color: COLORS[0],
        size: SIZES[0],
    });

    const location = useLocation();
    const productState: IProduct | undefined = location.state?.product;

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<IProduct | undefined>(productState);

    const { user } = useSelector((state: RootState) => state.user);
    const { product_id } = useParams<{ product_id: string }>();
    const shouldFetchProduct = !productState && isPage && product_id;

    // const { isLoading, refetch } = useProduct.useGetProductByProductId(
    //     shouldFetchProduct ? product_id : ""
    // );
    // const { mutate: addCart, isPending } = useCart.useAddToCart();
    const dispatch = useDispatch();

    useEffect(() => {
        if (shouldFetchProduct) {
            // refetch();
        } else if (!isPage) {
            setProduct(productModal);
        } else {
            setProduct(productState);
        }
    }, [isPage, productModal, productState
        // , refetch
    , shouldFetchProduct]);

    const handleColorChange = useCallback((color: (typeof COLORS)[number]) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            color,
        }));
    }, []);

    const handleSizeChange = useCallback((size: (typeof SIZES)[number]) => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            size,
        }));
    }, []);

    const handleChangeQuantity = useCallback((value: number) => {
        setQuantity(value);
    }, []);

    const handleAddToCart = useCallback(() => {
        if (user) {
            const data = {
                product_id: product?.id || "",
                quantity: quantity,
            };
            // dispatch(addToCart({ productId: product?.id || "", quantity }));
            // addCart(data);
        } else {
            toast.error("You must be logged in!");
        }
    }, [user, product, quantity, dispatch/*, addCart*/]);

    return (
        <div className="product-detail-frame">
            {/*{isLoading ? (*/}
            {/*    <Loading />*/}
            {/*) : (*/}
                <>
                    <ProductImage product={product} />
                    <div className="product-detail-frame__right">
                        <ProductInfo
                            product={product}
                            options={options}
                            onColorChange={handleColorChange}
                            onSizeChange={handleSizeChange}
                        />
                        <ProductActions
                            product={product}
                            quantity={quantity}
                            onChangeQuantity={handleChangeQuantity}
                            onAddToCart={handleAddToCart}
                            isPending={true
                            // isPending
                        }
                        />
                        <hr />
                        <Accordion data={DataProductDetailInfo} />
                        {isPage && <ProductDetails />}
                    </div>
                </>
            {/*)}*/}
        </div>
    );
};

export const ProductDetailFrame = memo(ProductDetailFrameComponent);
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