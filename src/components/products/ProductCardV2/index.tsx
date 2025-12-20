import "./index.scss";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton } from "../../ui";
// import { formatMoney } from "../../../utils/util";
// mport { Product } from "../../../types/product-type";
// import { useCart } from "../../../hooks/useCart";i
import { useNavigate } from "react-router-dom";
// import { ROUTE } from "../../../utils/constant";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../../store/cart-slice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import toast from "react-hot-toast";
// import { useWishlist } from "../../../hooks/useWishlist";
// import { memo, useMemo } from "react";
import _ from "lodash";
import {path} from "../../../common/constants/path.ts";
import {IProduct} from "../../../common/models/Product.ts";
import {memo} from "react";
import {formatMoney} from "@/utils";

type ProductCardType = Omit<
    IProduct,
    | "avaiable"
    | "description"
    | "tags"
    | "dimensions"
    | "category"
    | "isActive"
    | "__v"
    | "attribute_product"
>;

interface ProductCardProps {
    product: ProductCardType;
    handleOpenModal: (product_id: string, product: any) => void;
}

const ProductCardComponentV2 = ({
    product,
    handleOpenModal,
}: ProductCardProps) => {
    const navigate = useNavigate();
    // const { mutate: addCart, isPending } = useCart.useAddToCart();
    const isPending=true
    // const { mutate: addWishlistMutation } = useWishlist.useAddToWishlist();
    // const { mutate: deleteWishListMutation } = useWishlist.useDeleteWishlist();
    // const { data, refetch } = useWishlist.useGetWishList();

    // const wishListProductId = _.map(data?.products, "_id");

    const { user } = useSelector((state: RootState) => state.user);

    // const dispatch = useDispatch();
    console.log("item",{product})
    const handleAddToCart = (
        event: React.MouseEvent<HTMLButtonElement>,
        product_id: string
    ) => {
        event.stopPropagation();
        if (user) {
            const data = {
                product_id: product_id,
                quantity: 1,
            };
            // dispatch(addToCart({ productId: product_id, quantity: 1 }));
            // addCart(data);
        } else {
            toast.error("You must be logged in!");
        }
    };

    const handleNavigateProductDetails = (product_id: string,id) => {
        navigate(`${path.PRODUCT_DETAIL}/${product_id}`, {
            state: { product,id },
        });
    };

    // const handleAddToWishList = (
    //     event: React.MouseEvent<HTMLButtonElement>,
    //     product_id: string
    // ) => {
    //     event.stopPropagation();
    //     // addWishlistMutation(
    //     //     { product_id },
    //     //     {
    //     //         onSuccess: () => {
    //     //             refetch();
    //     //         },
    //     //     }
    //     // );
    // };
    //
    // const handleDeleteFromWishList = (
    //     event: React.MouseEvent<HTMLButtonElement>,
    //     product_id: string
    // ) => {
    //     event.stopPropagation();
    //     // deleteWishListMutation(
    //     //     { product_id },
    //     //     {
    //     //         onSuccess: () => {
    //     //             refetch();
    //     //         },
    //     //     }
    //     // );
    // };
    // const isInWishList = useMemo(() => {
    //     return _.includes(wishListProductId, product._id);
    // }, [wishListProductId, product._id]);
    const buyQuantity=(totalSold)=>{

        return totalSold>1000 ?(totalSold / 1000).toFixed(1)+"K":totalSold>0 ? totalSold:null
    }
    return (
        <div
            className="product-card"
            onClick={() => handleNavigateProductDetails(product.title,product.dbId)}
        >
            <div className="product-card__image-container">
                <img
                    loading="lazy"
                    decoding="async"
                    src={product?.images?.[0]}
                    alt={product?.title}
                />
                {/*<div className="product-card__price">*/}
                {/*    1234567*/}
                {/*    /!*{formatMoney(product.price)}*!/*/}
                {/*</div>*/}
            </div>
            {/*<div className="product-card__actions">*/}
            {/*    <IconButton*/}
            {/*        className={`product-card__favorite ${*/}
            {/*            // isInWishList ? "added" : */}
            {/*                ""*/}
            {/*        }`}*/}
            {/*        icon="solar:heart-bold"*/}
            {/*        // onClick={(event) =>*/}
            {/*        //     isInWishList*/}
            {/*        //         ? handleDeleteFromWishList(event, product._id)*/}
            {/*        //         : handleAddToWishList(event, product._id)*/}
            {/*        // }*/}
            {/*    />*/}

            {/*    <IconButton*/}
            {/*        onClick={(e) => {*/}
            {/*            e.stopPropagation();*/}
            {/*            handleOpenModal(product.productId, product);*/}
            {/*        }}*/}
            {/*        className="product-card__view"*/}
            {/*        icon="heroicons:viewfinder-circle-solid"*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="product-card__content">
                {/*<div className="product-card__content-brand">*/}
                {/*    branffffffffffffff ffffffffffffffffffff ffffffffffffff fffffffffffffffff*/}
                {/*    {product.brand}*/}
                {/*</div>*/}
                <div className="product-card__content-name">{product.title}</div>
                <div className="product-card__content-price-wrapper">
                    <div className="price-wrapper__discount-price">
                        {formatMoney(product?.price)}
                    </div>
                    {product?.discount>0&&<div className="price-wrapper__percent-price">
                        -{product?.discount*100}%
                    </div>}
                </div>
            </div>

            <div className="product-card__bottom">
                {/*<Button*/}
                {/*    onClick={(event) => handleAddToCart(event, product.id)}*/}
                {/*    className="button"*/}
                {/*    variant="contain"*/}
                {/*    color="black"*/}
                {/*>*/}
                {/*    {isPending ? (*/}
                {/*        <Icon icon="eos-icons:bubble-loading" />*/}
                {/*    ) : (*/}
                {/*        <>*/}
                {/*            <Icon icon="streamline:shopping-cart-1-solid" />*/}
                {/*            Add to bag*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</Button>*/}
                <span className="rating">
                    {parseFloat((product?.rating)?.toFixed(1))}
                    <Icon icon="fluent-emoji-flat:star"/>
                    {/*<div className="text-reviews">(98 reviews)</div>*/}
                </span>
                <span className="sold">
                   Đã bán {buyQuantity(product?.sold)}
                </span>
            </div>
        </div>
    );
};

export const ProductCardV2 = memo(ProductCardComponentV2);
