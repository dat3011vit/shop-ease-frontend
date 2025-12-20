import {useDispatch, useSelector} from "react-redux";
// import { useCart } from "../../../hooks/useCart";
// import { Product } from "../../../types/product-type";
// import { formatMoney } from "../../../utils/util";
// import { removeCartItem } from "../../../store/cart-slice";
import emptyCart from "../../../assets/images/empty_cart.webp";
import { Button } from "../../ui";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import {memo, useEffect, useMemo} from "react";
import {path} from "../../../common/constants/path.ts";
import {IProduct} from "../../../common/models/Product.ts";
import {AppDispatch, RootState} from "../../../store";
import {fetchCart} from "../../../store/cart-slice.ts";
import {formatMoney} from "../../../utils";
import {ICartItem} from "../../../service/cart/cart.ts";

interface PopupCartProps {
    products?:ICartItem[];
    quantities: number[];
}

const PopupCartComponent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {  cartItems : products, loading:isPending}= useSelector((state:RootState)=>state.cart)
    console.log("aa",products,isPending)
    const {user} = useSelector((state:RootState)=>state.user);
    useEffect(() => {
        console.log("aa call",user?.id)
            dispatch(fetchCart())
    }, [user]);
    const navigate = useNavigate();
    const quantities =10
    // const dispatch = useDispatch();
    // const { mutate: deleteCartItem, isPending } = useCart.useDeleteCart();

    const handleRemove = (
        event: React.MouseEvent<HTMLButtonElement>,
        productId: string
    ) => {
        // event.stopPropagation();
        // dispatch(removeCartItem({ productId }));
        // deleteCartItem(productId);
    };

    const calculateTotal = useMemo(() => {
        let total = 0;
        if (products && quantities && products.length === quantities.length) {
            total = products.reduce(
                (accumulator, product, index) =>
                    accumulator + product.price * quantities[index],
                0
            );
        }
        return total;
    }, [products, quantities]);

    return (
        <div className="popup-cart">
            <div className="popup-cart__list">
                <h3>Shopping cart</h3>
                <div>
                    {isPending ? (
                        <div className="popup-cart__loading">
                            <Icon icon="eos-icons:bubble-loading" />
                        </div>
                    ) : (
                        <>
                            {products && products.length ? (
                                products.map((product, index) => (
                                    <div
                                        key={product?.productId}
                                        className="popup-cart__item"
                                    >
                                        <div className="popup-cart__img">
                                            <img
                                                loading="lazy"
                                                src={product?.imageSrc}
                                                alt={product?.product}
                                                decoding="async"
                                            />
                                        </div>
                                        <div className="popup-cart__details">
                                            <div className="popup-cart__details--top">
                                                <div>
                                                    <h3>{product?.product}</h3>
                                                    <p className="info">
                                                        <span>
                                                            {product?.colors}-{product?.size}
                                                        </span>
                                                    </p>
                                                    {/*<p className="info">*/}
                                                    {/*    <span>*/}
                                                    {/*        {product.tags}*/}
                                                    {/*    </span>*/}
                                                    {/*    <span className="popup-cart__details--border"></span>*/}
                                                    {/*    <span>*/}
                                                    {/*        {product.brand}*/}
                                                    {/*    </span>*/}
                                                    {/*</p>*/}
                                                </div>
                                                <div className="popup-cart__details--price">
                                                    <span>

                                                        {formatMoney(
                                                            product?.price
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="popup-cart__details--bottom">
                                                {/*<p className="total">*/}
                                                {/*    x{quantities[index]}*/}
                                                {/*</p>*/}
                                                <button
                                                    className="remove"
                                                    onClick={(event) =>
                                                        handleRemove(
                                                            event,
                                                            product?.productId
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="popup-cart__empty">
                                    <img
                                        decoding="async"
                                        loading="lazy"
                                        src={emptyCart}
                                        alt="Empty Cart"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="popup-cart__actions">
                <div className="popup-cart__actions--info">
                    <span>
                        {/*<span>Subtotal</span>*/}
                        <p>Shipping and taxes calculated at checkout.</p>
                    </span>
                    {/*<span>1111111*/}
                    {/*    /!*{formatMoney(calculateTotal)}*!/*/}
                    {/*</span>*/}
                </div>
                <div className="popup-cart__actions--buttons">
                    <Button
                        variant="contain"
                        color="white"
                        onClick={() => {
                            navigate(path.CART);
                        }}
                    >
                        View Cart
                    </Button>
                    {/*<Button*/}
                    {/*    variant="contain"*/}
                    {/*    color="black"*/}
                    {/*    onClick={() => {*/}
                    {/*        navigate(path.CHECKOUT);*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    Checkout*/}
                    {/*</Button>*/}
                </div>
            </div>
        </div>
    );
};

export const PopupCart = memo(PopupCartComponent);
