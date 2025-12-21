import "./index.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";
import { PAYMENTS_METHOD, ROUTE } from "../../../utils/constant";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Product } from "../../../types/product-type";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../utils/util";
import { SHIPPING_PRICE, TAX_PRICE } from "../../../utils/enum";
import { TOderDetails } from "../../../types/order-type";
import { usePayment } from "../../../hooks/usePayment";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

interface CartOrderProps {
    products?: Product[];
    orderDetail?: TOderDetails | null;
    paymentMethod?: string;
    type: string;
    orderMethod?: string;
}

const CartOrder = ({
    products,
    orderDetail,
    paymentMethod,
    type = "cart" || "order",
}: CartOrderProps) => {
    const { t } = useTranslation('cart');
    const { cart } = useSelector((state: RootState) => state.cart);
    const { mutate: paymentOnline } = usePayment.usePaymentOnline();

    const subtotal = cart?.reduce((acc, item) => {
        const product = products?.find((p) => p._id === item.product_id);
        if (product) {
            return acc + item.quantity * product.price;
        }
        return acc;
    }, 0);

    const orderTotal =
        (subtotal || 0) + SHIPPING_PRICE + (subtotal || 0) * (TAX_PRICE / 100);

    const navigate = useNavigate();

    const handlePayment = () => {
        const orderId = orderDetail?._id || "";
        const data = {
            amount: orderDetail?.totalOrderItem,
            bankCode: "",
            language: "vn",
        };
        if (
            type === "order" &&
            paymentMethod === PAYMENTS_METHOD.ONLINE &&
            orderDetail
        ) {
            paymentOnline({ orderId, data });
        } else {
            toast.error("Please complete the payment steps");
        }
    };
    return (
        <div className="cart-order">
            {type === "cart" && <h3>{t('orderSummary')}</h3>}
            <div className="cart-order__details">
                <div className="cart-order__item">
                    <span className="cart-order__item--title">{t('subtotal')}</span>
                    <span className="cart-order__item--price">
                        {cart?.length ? formatMoney(subtotal || 0) : 0}
                    </span>
                </div>
                <div className="cart-order__item">
                    <span className="cart-order__item--title">
                        {t('shippingEstimate')}
                    </span>
                    <span className="cart-order__item--price">
                        {cart?.length ? formatMoney(SHIPPING_PRICE) : 0}
                    </span>
                </div>
                <div className="cart-order__item">
                    <span className="cart-order__item--title">
                        {t('taxEstimate')}
                    </span>
                    <span className="cart-order__item--price">
                        {TAX_PRICE}%
                    </span>
                </div>
                <div className="cart-order__item">
                    <span className="cart-order__item--total">{t('orderTotal')}</span>
                    <span className="cart-order__item--total">
                        {cart?.length ? formatMoney(orderTotal) : 0}
                    </span>
                </div>
                <div className="cart-order__btn">
                    <Button
                        variant="contain"
                        color="black"
                        onClick={
                            type === "cart"
                                ? () => navigate(ROUTE.CHECKOUT)
                                : handlePayment
                        }
                    >
                        {type === "cart" ? t('checkout') : t('confirmOrder')}
                    </Button>
                </div>
                <div className="cart-order__info">
                    <Icon icon="fluent:info-16-regular" />
                    <p>
                        {t('learnMore')} <Link to={""}>{t('taxes')}</Link> {t('and')}{" "}
                        <Link to={""}>{t('shipping')}</Link> {t('information')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartOrder;
