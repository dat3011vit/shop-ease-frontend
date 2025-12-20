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

const ProductCardComponent = ({
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
    const buyQuantity=(csq)=>{
        let totalSold=0;
        if(csq && Array.isArray(csq)){
            totalSold = csq.reduce((sum, item) => {
                if (item.sold) {
                    return sum + item.sold;
                }
                return sum;
            }, 0);
            // if (totalSold > 1000) {
            //     totalSold = (totalSold / 1000).toFixed(1); // Chuyển thành "K" nếu lớn hơn 1000
            // }
        }
        return totalSold>1000 ?(totalSold / 1000).toFixed(1)+"K":totalSold>0 ? totalSold:null
    }
    return (
        <div
            className="product-card-modern"
            onClick={() => handleNavigateProductDetails(product.title,product.productId)}
        >
            <div className="product-card-modern__image-wrapper">
                <div className="product-card-modern__image-container">
                    <img
                        loading="lazy"
                        decoding="async"
                        src={product?.images?.[0]?.url}
                        alt={product?.title}
                        className="product-card-modern__image"
                    />
                    <div className="product-card-modern__overlay">
                        <div className="product-card-modern__badges">
                            {product?.sale && (
                                <span className="product-card-modern__badge product-card-modern__badge--sale">
                                    -{product?.sale}%
                                </span>
                            )}
                            {product?.score >= 4.5 && (
                                <span className="product-card-modern__badge product-card-modern__badge--featured">
                                    <Icon icon="solar:star-bold" />
                                    Bán chạy
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-card-modern__content">
                <h3 className="product-card-modern__title">{product.title}</h3>
                
                <div className="product-card-modern__rating-section">
                    <div className="product-card-modern__rating">
                        <Icon icon="solar:star-bold-duotone" className="product-card-modern__star-icon" />
                        <span className="product-card-modern__rating-value">
                            {parseFloat((product?.score || 0)?.toFixed(1))}
                        </span>
                    </div>
                    {buyQuantity(product?.csq) && (
                        <span className="product-card-modern__sold">
                            Đã bán {buyQuantity(product?.csq)}
                        </span>
                    )}
                </div>

                <div className="product-card-modern__price-section">
                    <div className="product-card-modern__price-main">
                        {formatMoney(product?.price ? product.price * (1 - (product?.sale || 0) / 100) : 0)}
                    </div>
                    {product?.sale && product?.price && (
                        <div className="product-card-modern__price-original">
                            {formatMoney(product.price)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ProductCard = memo(ProductCardComponent);
